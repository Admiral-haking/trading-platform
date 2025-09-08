import React from 'react';
import dynamic from 'next/dynamic';
import Meta from '../components/Meta';

const TelegramChannelsView = dynamic(() => import('../views/telegram-channels'), { ssr: false });

export default function TelegramChannelsPage() {
  return (
    <>
      <Meta title="Telegram Channels" description="Select which Telegram channels to receive signals from" />
      <TelegramChannelsView />
    </>
  );
}
