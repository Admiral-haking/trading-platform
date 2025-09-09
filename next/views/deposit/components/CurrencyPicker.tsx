import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const PRIORITY_CCYS = ['USDT', 'BTC', 'TRX', 'ETH', 'NEAR'] as const;

type Props = {
  value: string;
  onChange: (ccy: string) => void;
};

export default function CurrencyPicker({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v)}
      size="small"
      sx={{ flexWrap: 'wrap' }}
    >
      {PRIORITY_CCYS.map((ccy) => (
        <ToggleButton key={ccy} value={ccy} sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
          {ccy}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

