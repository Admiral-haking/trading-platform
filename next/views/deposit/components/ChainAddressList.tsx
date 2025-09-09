import React from 'react';
import { Box, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import type { ChainAddresses } from '../../../types/deposit';

type Props = {
  ccy: string;
  addresses: ChainAddresses | null;
  loading?: boolean;
  error?: string | null;
};

export default function ChainAddressList({ ccy, addresses, loading, error }: Props) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const onCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1200);
    } catch {}
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Deposit addresses</Typography>
          {loading && <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading {ccy} addresses…</Typography>}
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          {!loading && !error && addresses && Object.keys(addresses).length === 0 && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>No chains available for {ccy}.</Typography>
          )}
          {!loading && !error && addresses && (
            <Stack spacing={1}>
              {Object.entries(addresses).map(([chain, address]) => (
                <Box key={chain} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" color="primary" label={`${ccy} · ${chain}`} sx={{ fontWeight: 700 }} />
                  <Typography variant="body2" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all', flex: 1 }}>
                    {address || '-'}
                  </Typography>
                  <Tooltip title={copiedKey === chain ? 'Copied' : 'Copy'}>
                    <IconButton size="small" onClick={() => onCopy(address, chain)} disabled={!address}>
                      {copiedKey === chain ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

