import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const MonitorView = dynamic(() => import('../views/monitor'), { ssr: false });

export default function MonitorPage() {
  return (
    <>
      <Meta title="Monitor" description="CoinEx request queue monitor" />
      <MonitorView />
    </>
  );
}

