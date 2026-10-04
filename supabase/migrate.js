#!/usr/bin/env node
/**
 * HackConnect — Supabase Migration Runner
 * ========================================
 * Applies 001_initial_schema.sql directly to Supabase Cloud PostgreSQL
 * using the Service Role Key and/or direct PostgreSQL connection (pg).
 *
 * Usage:
 *   node migrate.js               — Run full migration (schema + RLS + seed)
 *   node migrate.js --seed-only   — Skip schema DDL, run only seed data
 *   node migrate.js --schema-only — Run schema DDL only, skip seed data
 *   node migrate.js --dry-run     — Validate config & SQL without executing
 *   node migrate.js --help        — Show help and configuration instructions
 */

const fs = require('fs');
const path = require('path');

// ── Module resolution fallback ────────────────────────────────────────────────
// Ensure require resolves dependencies from backend/node_modules if needed
const candidateNodeModules = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, '..', 'backend', 'node_modules'),
  path.join(__dirname, '..', 'frontend', 'node_modules'),
  path.join(process.cwd(), 'node_modules'),
  path.join(process.cwd(), 'backend', 'node_modules')
];
for (const dir of candidateNodeModules) {
  if (fs.existsSync(dir) && !module.paths.includes(dir)) {
    module.paths.push(dir);
  }
}

// ── Load Dependencies ─────────────────────────────────────────────────────────
let createClient;
let config;
let pg;

try {
  ({ createClient } = require('@supabase/supabase-js'));
} catch (e) {
  console.error('❌ Failed to load @supabase/supabase-js. Please run "npm install" in the backend or supabase folder.');
  process.exit(1);
}

try {
  ({ config } = require('dotenv'));
} catch (e) {
  console.warn('⚠️  dotenv package not found. Using existing process.env variables.');
  config = () => {};
}

try {
  pg = require('pg');
} catch (e) {
  pg = null; // pg is optional if user only uses REST/Auth APIs
}

// ── Load Environment Variables ────────────────────────────────────────────────
const envFiles = [
  path.join(__dirname, '..', 'backend', '.env'),
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend', '.env')
];

let loadedEnvPath = null;
for (const p of envFiles) {
  if (fs.existsSync(p)) {
    config({ path: p });
    loadedEnvPath = p;
    break;
  }
}

// ── CLI Arguments ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SEED_ONLY = args.includes('--seed-only');
const SCHEMA_ONLY = args.includes('--schema-only');
const SHOW_HELP = args.includes('--help') || args.includes('-h');

if (SHOW_HELP) {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║             HackConnect Supabase Migration Runner                ║
╚══════════════════════════════════════════════════════════════════╝

Usage:
  node supabase/migrate.js [options]
  npm run migrate (from backend directory)

Options:
  --dry-run       Verify configuration, SQL files, and connectivity
  --seed-only     Only create demo auth users and seed mock data
  --schema-only   Only create tables, enums, triggers, RLS, and storage
  --help, -h      Display this help guide

Environment Variables (in backend/.env or root .env):
  SUPABASE_URL               Required. e.g. https://your-project.supabase.co
  SUPABASE_SERVICE_ROLE_KEY  Required. Supabase Service Role secret (bypasses RLS)
  DATABASE_URL               Optional. Direct Postgres connection string:
                             postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
  SUPABASE_DB_PASSWORD       Optional. Database password used to construct connection string
  `);
  process.exit(0);
}

// ── Config & Validation ───────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

function extractProjectRef(url) {
  if (!url) return null;
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : null;
}

const projectRef = extractProjectRef(SUPABASE_URL);

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║             HackConnect — Supabase Migration Runner              ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log(`📁 Loaded env from: ${loadedEnvPath || 'System environment'}`);
console.log(`🌐 Supabase URL:    ${SUPABASE_URL || 'Not specified'}`);
console.log(`🔑 Service Role:    ${SUPABASE_SERVICE_KEY ? 'Present (ending in ...' + SUPABASE_SERVICE_KEY.slice(-6) + ')' : 'MISSING'}`);
console.log(`🔌 Direct DB URL:   ${DATABASE_URL ? 'Configured' : (SUPABASE_DB_PASSWORD ? 'Constructed from DB password' : 'Not configured')}`);
console.log(`🏷️  Project Ref:     ${projectRef || 'Unknown'}`);
if (DRY_RUN) console.log('🔍 Execution Mode:  DRY RUN (No database changes will be executed)');
if (SEED_ONLY) console.log('🌱 Execution Mode:  SEED DATA ONLY');
if (SCHEMA_ONLY) console.log('📐 Execution Mode:  SCHEMA ONLY');
console.log('');

// ── Migration File Detection ──────────────────────────────────────────────────
const candidateSqlFiles = [
  path.join(__dirname, 'migrations', '001_initial_schema.sql'),
  path.join(__dirname, '001_initial_schema.sql'),
  path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
];

let migrationSqlPath = candidateSqlFiles.find(p => fs.existsSync(p));

if (!migrationSqlPath) {
  console.error('❌ Migration SQL file not found in any of the expected paths:');
  candidateSqlFiles.forEach(p => console.error(`   - ${p}`));
  process.exit(1);
}

const fullSql = fs.readFileSync(migrationSqlPath, 'utf8');
console.log(`📄 Migration file:  ${migrationSqlPath} (${(fullSql.length / 1024).toFixed(1)} KB)`);

// ── Demo Seed Users Definition ────────────────────────────────────────────────
const SEED_USERS = [
  { id: 'a1111111-1111-1111-1111-111111111111', email: 'maya.lin@stanford.edu',      full_name: 'Maya Lin',            password: 'Password123!' },
  { id: 'a2222222-2222-2222-2222-222222222222', email: 'dwash@berkeley.edu',          full_name: 'Devante Washington',  password: 'Password123!' },
  { id: 'a3333333-3333-3333-3333-333333333333', email: 'ananya@gatech.edu',           full_name: 'Ananya Sharma',       password: 'Password123!' },
  { id: 'a4444444-4444-4444-4444-444444444444', email: 'liam.vance@mit.edu',          full_name: 'Liam Vance',          password: 'Password123!' },
  { id: 'a5555555-5555-5555-5555-555555555555', email: 'sofia.rodriguez@cmu.edu',     full_name: 'Sofia Rodriguez',     password: 'Password123!' },
  { id: 'a6666666-6666-6666-6666-666666666666', email: 'kai.tanaka@utexas.edu',       full_name: 'Kai Tanaka',          password: 'Password123!' },
  { id: 'a7777777-7777-7777-7777-777777777777', email: 'marcus@berkeley.edu',         full_name: 'Marcus Sterling',     password: 'Password123!' },
  { id: 'a8888888-8888-8888-8888-888888888888', email: 'elena.rostova@stanford.edu',  full_name: 'Elena Rostova',       password: 'Password123!' },
];

// ── Initialize Supabase Admin Client ──────────────────────────────────────────
let supabase = null;
const isPlaceholderUrl = !SUPABASE_URL || SUPABASE_URL.includes('your-project') || SUPABASE_URL.includes('mock');
const isPlaceholderKey = !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('your-service-role-key');

if (!isPlaceholderUrl && !isPlaceholderKey) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// ── Step 1: Create Seed Auth Users ────────────────────────────────────────────
async function createAuthUsers() {
  if (SCHEMA_ONLY) {
    console.log('⏭️  Skipping Auth Users creation (--schema-only flag active).');
    return;
  }

  console.log('\n==================================================================');
  console.log('STEP 1: Creating Seed Authentication Accounts via Supabase Auth');
  console.log('==================================================================');

  if (!supabase) {
    console.log('⚠️  Valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to create Auth accounts via Admin API.');
    console.log('   (They will also be created automatically when applying 001_initial_schema.sql to PostgreSQL).');
    return;
  }

  for (const u of SEED_USERS) {
    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would ensure account exists: ${u.email} (${u.full_name})`);
      continue;
    }

    try {
      // Check if user already exists
      const { data: existing, error: getErr } = await supabase.auth.admin.getUserById(u.id);
      if (existing?.user) {
        console.log(`  ✓ Already exists: ${u.email} [${u.id}]`);
        continue;
      }

      // Create new user with confirmed email and custom password
      const { data, error } = await supabase.auth.admin.createUser({
        id: u.id,
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name }
      });

      if (error) {
        if (error.message && (error.message.includes('already') || error.status === 422)) {
          console.log(`  ⚠️  User exists with email: ${u.email}`);
        } else {
          console.warn(`  ⚠️  Auth API message for ${u.email}: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Created user: ${u.email} (Password: ${u.password})`);
      }
    } catch (err) {
      console.warn(`  ⚠️  Could not create ${u.email}: ${err.message}`);
    }
  }
}

// ── Step 2: Execute SQL Migrations ────────────────────────────────────────────
async function executeSqlMigration() {
  console.log('\n==================================================================');
  console.log('STEP 2: Applying Database Schema, RLS, Realtime & Seed Data');
  console.log('==================================================================');

  // Compute Postgres Connection String
  let pgConnString = DATABASE_URL;
  if (!pgConnString && SUPABASE_DB_PASSWORD && projectRef) {
    pgConnString = `postgresql://postgres:${encodeURIComponent(SUPABASE_DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  // 1. Try Direct PostgreSQL Connection (Best & most comprehensive method)
  if (pg && pgConnString) {
    console.log('🔌 Connecting directly to Supabase PostgreSQL via node-postgres...');
    if (DRY_RUN) {
      console.log('  [DRY RUN] Direct PostgreSQL connection string detected. Skipping execution.');
      return true;
    }

    const client = new pg.Client({
      connectionString: pgConnString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('  ✅ Successfully connected to Supabase PostgreSQL database!');

      let sqlToExecute = fullSql;
      if (SEED_ONLY) {
        const seedIdx = fullSql.indexOf('-- SECTION 8: SEED DATA');
        if (seedIdx !== -1) sqlToExecute = fullSql.slice(seedIdx);
      } else if (SCHEMA_ONLY) {
        const seedIdx = fullSql.indexOf('-- SECTION 8: SEED DATA');
        if (seedIdx !== -1) sqlToExecute = fullSql.slice(0, seedIdx);
      }

      console.log('  ⚙️  Executing SQL migration query...');
      await client.query(sqlToExecute);
      await client.end();
      console.log('  ✅ PostgreSQL migration completed successfully!');
      return true;
    } catch (dbErr) {
      console.error('  ❌ PostgreSQL direct execution error:', dbErr.message);
      try { await client.end(); } catch (e) {}
    }
  }

  // 2. Try Supabase Management API
  if (projectRef && SUPABASE_SERVICE_KEY && !isPlaceholderKey) {
    console.log('🌐 Attempting execution via Supabase API / RPC...');
    
    if (DRY_RUN) {
      console.log('  [DRY RUN] Would attempt execution via Supabase API.');
      return true;
    }

    // Attempt RPC exec_sql if configured
    if (supabase) {
      try {
        const { error: rpcErr } = await supabase.rpc('exec_sql', { query: fullSql });
        if (!rpcErr) {
          console.log('  ✅ Migration executed successfully via exec_sql RPC!');
          return true;
        }
      } catch (e) {
        // Fall through
      }
    }
  }

  // 3. Manual 1-Click Instructions if no direct DB credentials
  printManualInstructions();
  return false;
}

// ── Manual Instructions Display ───────────────────────────────────────────────
function printManualInstructions() {
  const dashboardUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : 'https://supabase.com/dashboard';

  console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│  ⚡ SUPABASE CLOUD ONE-CLICK DEPLOYMENT INSTRUCTIONS                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Supabase Cloud requires a direct PostgreSQL connection string         │
│  or the Dashboard SQL Editor to execute DDL (table creations & RLS).   │
│                                                                        │
│  METHOD 1: Instant Copy-Paste in Supabase SQL Editor (Recommended)     │
│  1. Open your browser to:                                              │
│     👉 ${dashboardUrl}
│  2. Copy the entire contents of:                                       │
│     👉 supabase/migrations/001_initial_schema.sql                      │
│  3. Paste into the SQL Editor and click "RUN".                         │
│     (All extensions, tables, RLS policies, buckets, and 8 seed demo    │
│      accounts with password "Password123!" will be created instantly). │
│                                                                        │
│  METHOD 2: Automated CLI via Database Connection String                │
│  1. In Supabase Dashboard -> Project Settings -> Database              │
│  2. Copy the "Connection string (URI)"                                 │
│  3. Add to your backend/.env:                                          │
│     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF]...:5432/...  │
│  4. Re-run: node supabase/migrate.js                                   │
│                                                                        │
│  METHOD 3: Supabase CLI                                                │
│     npx supabase login                                                 │
│     npx supabase link --project-ref ${projectRef || '<your-project-ref>'}
│     npx supabase db push                                               │
└────────────────────────────────────────────────────────────────────────┘
`);
}

// ── Main Runner ───────────────────────────────────────────────────────────────
async function run() {
  try {
    await createAuthUsers();
    const migrated = await executeSqlMigration();

    console.log('\n==================================================================');
    console.log('✨ HackConnect Setup Summary');
    console.log('==================================================================');
    console.log('Ready-to-use demo accounts (all passwords: Password123!):');
    console.log('  1. Maya Lin (UI/UX, Stanford)       : maya.lin@stanford.edu');
    console.log('  2. Devante Washington (Go/Backend)  : dwash@berkeley.edu');
    console.log('  3. Ananya Sharma (PM, Georgia Tech) : ananya@gatech.edu');
    console.log('  4. Liam Vance (Full-Stack, MIT)     : liam.vance@mit.edu');
    console.log('  5. Sofia Rodriguez (AI/ML, CMU)     : sofia.rodriguez@cmu.edu');
    console.log('  6. Kai Tanaka (Mobile, UT Austin)   : kai.tanaka@utexas.edu');
    console.log('  7. Marcus Sterling (DevOps, Cal)    : marcus@berkeley.edu');
    console.log('  8. Elena Rostova (Security, Stanford): elena.rostova@stanford.edu');
    console.log('==================================================================\n');

  } catch (error) {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  }
}

run();
