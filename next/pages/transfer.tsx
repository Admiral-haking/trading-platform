import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const TransferView = dynamic(() => import('../views/transfer'), { ssr: false });

export default function TransferPage() {
  return (
    <>
      <Meta title="Transfer" description="Transfer funds between accounts" />
      <TransferView />
    </>
  );
}

