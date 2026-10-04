import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/feed/CreatePostForm';
import SEOHead from '../components/shared/SEOHead';
import { ROUTES } from '../config/routes';

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreated = () => {
    navigate(ROUTES.FEED);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <SEOHead title="Create Post — HackConnect" />
      <CreatePostForm
        onPostCreated={handleCreated}
        onCancel={() => navigate(ROUTES.FEED)}
      />
    </div>
  );
}
