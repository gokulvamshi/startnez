import React from 'react';
import { Github, Globe, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export default function ProfileLinks({
  githubUrl,
  portfolioUrl,
  twitterUrl,
  linkedinUrl,
  websiteUrl
}) {
  const links = [
    { name: 'GitHub', url: githubUrl, icon: Github },
    { name: 'Portfolio', url: portfolioUrl, icon: Globe },
    { name: 'LinkedIn', url: linkedinUrl, icon: Linkedin },
    { name: 'Twitter / X', url: twitterUrl, icon: Twitter },
    { name: 'Website', url: websiteUrl, icon: ExternalLink }
  ].filter((l) => Boolean(l.url));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{link.name}</span>
          </a>
        );
      })}
    </div>
  );
}
