import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { Markets } from '../../../types/coinex';

type Props = { markets: Markets };

export default function MarketsTable({ markets }: Props) {
  const rows = React.useMemo(() => Object.values(markets).sort((a, b) => a.market.localeCompare(b.market)).slice(0, 25), [markets]);
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="overline">Market</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Last</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Index</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Mark</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Open Interest</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Volume</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((m) => (
            <TableRow key={m.market} hover>
              <TableCell>{m.market}</TableCell>
              <TableCell align="right">{m.last}</TableCell>
              <TableCell align="right">{m.index_price}</TableCell>
              <TableCell align="right">{m.mark_price}</TableCell>
              <TableCell align="right">{m.open_interest_volume}</TableCell>
              <TableCell align="right">{m.volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

