import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const AboutView = dynamic(() => import('../views/about'), { ssr: false });

export default function AboutPage() {
  return (
    <>
      <Meta title="About Me" description="About the developer and project" />
      <AboutView />
    </>
  );
}

