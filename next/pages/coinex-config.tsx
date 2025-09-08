import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const CoinexConfigView = dynamic(() => import('../views/coinex-config'), { ssr: false });

export default function CoinexConfigPage() {
  return (
    <>
      <Meta title="CoinEx Configuration" description="Set your CoinEx API credentials and strategy" />
      <CoinexConfigView />
    </>
  );
}
