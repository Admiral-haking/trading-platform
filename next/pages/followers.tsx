import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const FollowersView = dynamic(() => import('../views/followers'), { ssr: false });

export default function FollowersPage() {
  return (
    <>
      <Meta title="Followers" description="Manage follower webhooks" />
      <FollowersView />
    </>
  );
}

