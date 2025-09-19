import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { CoinexFullResponse, Markets } from '../../../types/coinex';

function num(n: number, d = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

type Props = { data: CoinexFullResponse };

export default function AssetsTable({ data }: Props) {
  const rows = React.useMemo(() => {
    const mk = data.markets;
    const findUsdtPrice = (ccy: string, markets: Markets) => {
      if (ccy === 'USDT') return 1;
      // prefer direct key
      const direct = markets[`${ccy}USDT`];
      if (direct?.last) return parseFloat(direct.last);
      // fallback: scan by base_ccy/quote_ccy
      for (const v of Object.values(markets)) {
        if ((v as any).base_ccy === ccy && (v as any).quote_ccy === 'USDT' && (v as any).last) {
          return parseFloat((v as any).last);
        }
      }
      return 0;
    };

    return data.assets
      .map((a) => {
        const c = (a.ccy || '').toUpperCase();
        const available = parseFloat(a.available || '0');
        const frozen = parseFloat(a.frozen || '0');
        const total = available + frozen;
        const price = findUsdtPrice(c, mk);
        const value = total * price;
        return { ccy: c, available, frozen, total, price, value };
      })
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '95vw', overflowX: 'scroll' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="overline">Asset</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Available</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Frozen</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Total</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Price (USDT)</Typography></TableCell>
            <TableCell align="right"><Typography variant="overline">Value (USDT)</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.ccy} hover>
              <TableCell>{r.ccy}</TableCell>
              <TableCell align="right">{num(r.available, 6)}</TableCell>
              <TableCell align="right">{num(r.frozen, 6)}</TableCell>
              <TableCell align="right">{num(r.total, 6)}</TableCell>
              <TableCell align="right">{num(r.price)}</TableCell>
              <TableCell align="right">{num(r.value)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5}><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total</Typography></TableCell>
            <TableCell align="right"><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{num(totalValue)}</Typography></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
