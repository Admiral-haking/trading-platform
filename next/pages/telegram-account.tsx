import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

// Reuse the existing Telegram login view for re-login
const LoginTelegramView = dynamic(() => import('../views/login-telegram'), { ssr: false });

export default function TelegramAccountPage() {
  return (
    <>
      <Meta title="Telegram Account" description="Re-login to a Telegram account" />
      <LoginTelegramView />
    </>
  );
}

