import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const MarketsView = dynamic(() => import('../views/markets'), { ssr: false });

export default function MarketsPage() {
  return (
    <>
      <Meta title="Markets" description="Browse market prices and stats" />
      <MarketsView />
    </>
  );
}
