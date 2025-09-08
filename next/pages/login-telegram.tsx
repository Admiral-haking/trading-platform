import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const LoginTelegramView = dynamic(() => import('../views/login-telegram'), { ssr: false });

export default function LoginTelegramPage() {
  return (
    <>
      <Meta title="Login with Telegram" description="Authorize the app using Telegram" />
      <LoginTelegramView />
    </>
  );
}
