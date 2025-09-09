import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const ConfigsView = dynamic(() => import('../views/configs'), { ssr: false });

export default function ConfigsPage() {
  return (
    <>
      <Meta title="Configs" description="Reconfigure application settings" />
      <ConfigsView />
    </>
  );
}

