import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const DepositView = dynamic(() => import('../views/deposit'), { ssr: false });

export default function DepositPage() {
  return (
    <>
      <Meta title="Deposit" description="Deposit funds into your account" />
      <DepositView />
    </>
  );
}

