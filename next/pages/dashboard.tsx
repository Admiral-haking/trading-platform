import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const DashboardView = dynamic(() => import('../views/dashboard'), { ssr: false });

export default function DashboardPage() {
  return (
    <>
      <Meta title="Dashboard" description="Portfolio overview and active signals" />
      <DashboardView />
    </>
  );
}
