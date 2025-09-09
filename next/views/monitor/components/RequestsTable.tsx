import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Tooltip,
  Box,
} from '@mui/material';
import type { MonitorItem } from '../../../types/monitor';

type Props = {
  rows: MonitorItem[] | null;
  loading?: boolean;
  error?: string | null;
};

function trimUrl(url: string) {
  try {
    const u = new URL(url);
    return u.pathname + (u.search || '');
  } catch {
    return url;
  }
}

export default function RequestsTable({ rows, loading, error }: Props) {
  const count = rows?.length || 0;
  return (
    <TableContainer component={Paper}>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Pending Requests</Typography>
        <Chip size="small" color={count > 0 ? 'warning' : 'default'} label={count} />
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>Params</TableCell>
            <TableCell>Body</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading…</Typography>
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography color="error" variant="body2">{error}</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Queue is empty.</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows && rows.map((r, idx) => (
            <TableRow key={idx} hover>
              <TableCell sx={{ maxWidth: 360 }}>
                <Tooltip title={r.url}>
                  <span>{trimUrl(r.url)}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ fontFamily: 'ui-monospace, monospace', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {Object.keys(r.params || {}).length ? JSON.stringify(r.params) : '-'}
              </TableCell>
              <TableCell sx={{ fontFamily: 'ui-monospace, monospace', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {Object.keys(r.body || {}).length ? JSON.stringify(r.body) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

