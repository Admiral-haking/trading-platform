import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const TakeProfitView = dynamic(() => import('../views/take-profit'), { ssr: false });

export default function TakeProfitPage() {
  return (
    <>
      <Meta title="Take Profit" description="Configure take profit strategies" />
      <TakeProfitView />
    </>
  );
}

