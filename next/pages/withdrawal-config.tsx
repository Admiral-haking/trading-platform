import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const WithdrawalConfigView = dynamic(() => import('../views/withdrawal-config'), { ssr: false });

export default function WithdrawalConfigPage() {
  return (
    <>
      <Meta title="Withdrawal Configuration" description="Set weekly withdrawal schedule and wallet" />
      <WithdrawalConfigView />
    </>
  );
}
