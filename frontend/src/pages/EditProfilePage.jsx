import React from 'react';
import EditProfileForm from '../components/profile/EditProfileForm';
import SEOHead from '../components/shared/SEOHead';

export default function EditProfilePage() {
  return (
    <div className="py-4">
      <SEOHead title="Edit Profile — HackConnect" />
      <EditProfileForm />
    </div>
  );
}
