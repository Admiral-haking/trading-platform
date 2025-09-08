import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const SignalsView = dynamic(() => import('../views/signals'), { ssr: false });

export default function SignalsPage() {
  return (
    <>
      <Meta title="Signals" description="Live trading signals stream" />
      <SignalsView />
    </>
  );
}
