import { useEffect } from 'react';

export const SEOHead = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | HackConnect` : 'HackConnect — Student Hackathon & Teammate Finder';
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description]);

  return null;
};

export default SEOHead;
