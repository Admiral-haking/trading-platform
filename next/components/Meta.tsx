import Head from 'next/head';
import React from 'react';

export default function Meta({ title, description }: { title: string; description?: string }) {
  const fullTitle = title ? `${title} · Hippogriff Trade` : 'Hippogriff Trade';
  return (
    <Head>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
  );
}

