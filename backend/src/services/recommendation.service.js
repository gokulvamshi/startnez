const { COMPLEMENTARY_SKILLS } = require('../utils/constants');

class RecommendationService {
  /**
   * Calculate recommendation score for candidate profile relative to current user
   */
  calculateScore(candidate, currentUser, candidateSkills = [], userSkills = [], connectionStatus = 'none') {
    // Exclude own profile, connected, pending, blocked
    if (candidate.id === currentUser?.id) return -1000;
    if (connectionStatus === 'connected' || connectionStatus === 'pending_sent' || connectionStatus === 'pending_received' || connectionStatus === 'blocked') {
      return -1000;
    }

    let score = 0;

    // If no currentUser logged in, rank by completeness and activity
    if (!currentUser) {
      if (candidate.profile_completeness > 70) score += 5;
      score += (candidate.connection_count || 0) * 0.2;
      return score;
    }

    // 1. Complementary Skills (+3 points per match)
    const userSkillNames = userSkills.map(s => s.skill_name || s);
    const candidateSkillNames = candidateSkills.map(s => s.skill_name || s);

    for (const uSkill of userSkillNames) {
      const complements = COMPLEMENTARY_SKILLS[uSkill] || [];
      for (const cSkill of candidateSkillNames) {
        if (complements.includes(cSkill)) {
          score += 3;
        }
      }
    }

    // 2. Same College (+2 points)
    if (currentUser.college && candidate.college && currentUser.college.toLowerCase() === candidate.college.toLowerCase()) {
      score += 2;
    }

    // 3. Same Year (+1 point) or Adjacent Year (+0.5 point)
    if (currentUser.year_of_study && candidate.year_of_study) {
      if (currentUser.year_of_study === candidate.year_of_study) {
        score += 1;
      } else {
        const yearIndex = (yr) => ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Recent Graduate'].indexOf(yr);
        const diff = Math.abs(yearIndex(currentUser.year_of_study) - yearIndex(candidate.year_of_study));
        if (diff === 1) {
          score += 0.5;
        }
      }
    }

    // 4. Similar Interests (+1 point per match)
    const userInterests = currentUser.interests || [];
    const candidateInterests = candidate.interests || [];
    const sharedInterests = candidateInterests.filter(i => userInterests.includes(i));
    score += sharedInterests.length * 1;

    // 5. Looking for same things (+1 point per match)
    const userLooking = currentUser.looking_for || [];
    const candidateLooking = candidate.looking_for || [];
    const sharedLooking = candidateLooking.filter(l => userLooking.includes(l));
    score += sharedLooking.length * 1;

    // 6. Profile Completeness (+0.5 if > 70%)
    if ((candidate.profile_completeness || 0) > 70) {
      score += 0.5;
    }

    // 7. Recently Active (+1 if updated in last 7 days)
    if (candidate.updated_at) {
      const daysSinceUpdate = (Date.now() - new Date(candidate.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate <= 7) {
        score += 1;
      }
    }

    return Math.round(score * 10) / 10;
  }
}

module.exports = new RecommendationService();
