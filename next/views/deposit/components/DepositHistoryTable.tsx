import React from 'react';
import {
  Chip,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { DepositRecord } from '../../../types/deposit';

type Props = {
  rows: DepositRecord[] | null;
  loading?: boolean;
  error?: string | null;
};

function formatAmount(v?: string) {
  if (!v) return '-';
  const n = Number(v);
  if (Number.isFinite(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
  return v;
}

export default function DepositHistoryTable({ rows, loading, error }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Chain</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tx</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading history…</Typography>
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography color="error" variant="body2">{error}</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>No deposit records.</Typography>
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows && rows.map((r) => (
            <TableRow key={r.deposit_id} hover>
              <TableCell>{new Date(r.created_at * 1000).toLocaleString()}</TableCell>
              <TableCell>{r.ccy}</TableCell>
              <TableCell>{r.chain}</TableCell>
              <TableCell align="right">{formatAmount(r.actual_amount || r.amount)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={(r.status || '').replace(/_/g, ' ')}
                  color={r.status === 'success' ? 'success' : r.status === 'confirming' ? 'warning' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              <TableCell>
                {r.tx_explorer_url ? (
                  <MuiLink href={r.tx_explorer_url} target="_blank" rel="noopener noreferrer" underline="hover">
                    View
                  </MuiLink>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
