import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const WithdrawalView = dynamic(() => import('../views/withdrawal'), { ssr: false });

export default function WithdrawalPage() {
  return (
    <>
      <Meta title="Withdrawal" description="Withdraw funds from your account" />
      <WithdrawalView />
    </>
  );
}

