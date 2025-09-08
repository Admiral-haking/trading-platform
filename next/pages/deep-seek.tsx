import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const DeepSeekView = dynamic(() => import('../views/deep-seek'), { ssr: false });

export default function DeepSeekPage() {
  return (
    <>
      <Meta title="DeepSeek Setup" description="Configure your DeepSeek API key" />
      <DeepSeekView />
    </>
  );
}
