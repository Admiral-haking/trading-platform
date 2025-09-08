import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const LoginView = dynamic(() => import('../views/login'), { ssr: false });

export default function LoginPage() {
  return (
    <>
      <Meta title="Login" description="Sign in to your trading account" />
      <LoginView />
    </>
  );
}
