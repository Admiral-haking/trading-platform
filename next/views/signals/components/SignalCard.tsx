import React from 'react';
import { Card, CardContent, Chip, Stack, Typography, IconButton, Tooltip, Button, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import type { Markets, Signal } from '../../../types/coinex';
import SignalLogsDialog from '../../dashboard/components/SignalLogsDialog';
import api from '../../../utils/axios';
import TPChip from './st-chip';
import STChip from './sl-chip';
import Detail from './detail';
import { green } from '@mui/material/colors';
import { getTime } from '../utils/time';

function fmt(n: number) {
  const d = Math.abs(n) < 1 ? 4 : 2;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

export default function SignalCard({ s, markets }: { s: Signal, markets: Markets }) {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const long = s.position === 'LONG';
  const posChip = (
    <Chip
      icon={long ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      label={`${s.position} · x${s.leverage}`}
      size="small"
      sx={{ color: long ? 'success.main' : 'error.main', borderColor: long ? 'success.main' : 'error.main', bgcolor: 'transparent', borderWidth: 1, borderStyle: 'solid', '& .MuiChip-icon': { color: long ? 'success.main' : 'error.main' }, fontWeight: 700 }}
      variant="outlined"
    />
  );

  const stateColor = s.state === 'pending' ? 'warning' : s.state === 'filled' ? 'success' : s.state === 'order placed' ? 'info' : s.state === 'finished' ? 'primary' : 'default';

  if (hidden) return null;

  function getRelativeSL() {
    const r = new RegExp("stop loss was moved from", 'i')
    const movings = s.logs.filter(x => r.test(x.message))
    const last = movings[movings.length - 1]?.message;

    if (!last) return null;

    const newSL = last.match(/stop loss was moved from .+ to ([0-9]+\.?[0-9]+)/)?.[1];

    if (!newSL) return null;

    return Number(newSL)
  }

  const relativeSL = getRelativeSL();

  const lastPrice = Number(markets[s.market]?.last || 0)
  const marketPrice = Number(markets[s.market]?.mark_price || 0)

  return (
    <Card variant="outlined" sx={{
      background: (t) => t.palette.mode === 'dark' ? 'linear-gradient(45deg, rgba(0, 229, 168, 0.12), rgba(0, 0, 0, 0.04))' : 'linear-gradient(180deg, rgba(12,123,232,0.05), rgba(123,70,255,0.03))',
      borderRadius: 1,
      height: '100%',
      position: 'relative'
    }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{s.market}</Typography>
              {posChip}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label={s.state} color={stateColor as any} size="small" />
              {s.sl_tp_done && (
                <Tooltip title="TP/SL configured"><DoneAllRoundedIcon color="success" fontSize="small" /></Tooltip>
              )}
              <Tooltip title="View logs"><IconButton size="small" onClick={() => setOpen(true)}><ReceiptLongOutlinedIcon /></IconButton></Tooltip>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Box sx={{ width: '48%' }}>
              <Detail
                text='Entry'
                color="info.main"
                value={fmt(s.entry).concat(" USDT")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m12.404 8.303l3.431 3.327c.22.213.22.527 0 .74l-6.63 6.43C8.79 19.201 8 18.958 8 18.43v-5.723z"></path><path fill="currentColor" d="M8 11.293V5.57c0-.528.79-.771 1.205-.37l2.481 2.406z" opacity={0.5}></path></svg>}
              />
              <Detail
                text='Stop Loss'
                color={!relativeSL ? "warning.main" : "text.secondary"}
                value={fmt(s.stopLoss).concat(" USDT")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-2.31 0-3.77 2.587-6.688 7.762l-.364.644c-2.425 4.3-3.638 6.45-2.542 8.022S6.214 21 11.636 21h.728c5.422 0 8.134 0 9.23-1.572s-.117-3.722-2.542-8.022l-.364-.645C15.77 5.587 14.311 3 12 3" opacity={0.5}></path><path fill="currentColor" d="M12 7.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2"></path></svg>}
              />
              {
                !!relativeSL && <Detail
                  text='Relative SL'
                  color="primary.main"
                  value={fmt(relativeSL as number).concat(" USDT")}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.5}></path><path fill="currentColor" d="M12 17.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75M12 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2"></path></svg>}
                />
              }
              {
                s.takeProfit.map((x, i) => <Detail
                  text={`Take Profit ${i + 1}`}
                  value={fmt(x).concat(" USDT")}
                  key={x}
                  color={(green as any)[((i + 2) * 100)] || "success.main"}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.5}></path><path d="M12 5.25a.75.75 0 0 1 .75.75v.317c1.63.292 3 1.517 3 3.183a.75.75 0 0 1-1.5 0c0-.678-.564-1.397-1.5-1.653v3.47c1.63.292 3 1.517 3 3.183s-1.37 2.891-3 3.183V18a.75.75 0 0 1-1.5 0v-.317c-1.63-.292-3-1.517-3-3.183a.75.75 0 0 1 1.5 0c0 .678.564 1.397 1.5 1.652v-3.469c-1.63-.292-3-1.517-3-3.183s1.37-2.891 3-3.183V6a.75.75 0 0 1 .75-.75m-.75 2.597c-.936.256-1.5.975-1.5 1.653s.564 1.397 1.5 1.652zm3 6.653c0-.678-.564-1.397-1.5-1.652v3.304c.936-.255 1.5-.974 1.5-1.652"></path></g></svg>}
                />)
              }
            </Box>
            {
              !!s.coinex_position && <Box sx={{ width: '48%' }}>
                <Detail
                  text='Realized PNL'
                  color={Number(s.coinex_position?.realized_pnl || 0) > 0 ? "success.main" : "error.main"}
                  value={fmt(Number(s.coinex_position?.realized_pnl || 0)).concat(" USDT")}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6.222 4.601a9.5 9.5 0 0 1 1.395-.771c1.372-.615 2.058-.922 2.97-.33c.913.59.913 1.56.913 3.5v1.5c0 1.886 0 2.828.586 3.414s1.528.586 3.414.586H17c1.94 0 2.91 0 3.5.912c.592.913.285 1.599-.33 2.97a9.5 9.5 0 0 1-10.523 5.435A9.5 9.5 0 0 1 6.222 4.601" opacity={0.5}></path><path fill="currentColor" d="M21.446 7.069a8.03 8.03 0 0 0-4.515-4.515C15.389 1.947 14 3.344 14 5v4a1 1 0 0 0 1 1h4c1.657 0 3.053-1.39 2.446-2.931"></path></svg>}
                />
                {
                  "unrealized_pln" in s.coinex_position && <Detail
                    text='UnRealized PNL'
                    color={Number(s.coinex_position?.unrealized_pln || 0) > 0 ? "success.main" : "error.main"}
                    value={fmt(Number(s.coinex_position?.unrealized_pln || 0)).concat(" USDT")}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M14 20.5V4.25c0-.728-.002-1.2-.048-1.546c-.044-.325-.115-.427-.172-.484s-.159-.128-.484-.172C12.949 2.002 12.478 2 11.75 2s-1.2.002-1.546.048c-.325.044-.427.115-.484.172s-.128.159-.172.484c-.046.347-.048.818-.048 1.546V20.5z" clipRule="evenodd"></path><path fill="currentColor" d="M8 8.75A.75.75 0 0 0 7.25 8h-3a.75.75 0 0 0-.75.75V20.5H8zm12 5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v6.75H20z" opacity={0.7}></path><path fill="currentColor" d="M1.75 20.5a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5z" opacity={0.5}></path></svg>}
                  />
                }
                <Detail
                  text='Last Price'
                  value={fmt(lastPrice).concat(" USDT")}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22" opacity={0.5}></path><path fill="currentColor" d="M12 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75m-5 3a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V9A.75.75 0 0 1 7 8.25m10 4a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75"></path></svg>}
                />
                <Detail
                  text='Market Price'
                  value={fmt(marketPrice).concat(" USDT")}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m17.967 6.558l-1.83-1.83c-1.546-1.545-2.318-2.318-3.321-2.605c-1.003-.288-2.068-.042-4.197.45l-1.228.283c-1.792.413-2.688.62-3.302 1.233S3.27 5.6 2.856 7.391l-.284 1.228c-.491 2.13-.737 3.194-.45 4.197c.288 1.003 1.061 1.775 2.606 3.32l1.83 1.83C9.248 20.657 10.592 22 12.262 22c1.671 0 3.015-1.344 5.704-4.033c2.69-2.69 4.034-4.034 4.034-5.705c0-1.67-1.344-3.015-4.033-5.704" opacity={0.5}></path><path fill="currentColor" d="M11.147 14.328c-.673-.672-.667-1.638-.265-2.403a.75.75 0 0 1 1.04-1.046c.34-.18.713-.276 1.085-.272a.75.75 0 0 1-.014 1.5a.88.88 0 0 0-.609.277c-.387.387-.285.775-.177.884c.11.109.497.21.884-.177c.784-.784 2.138-1.044 3.006-.177c.673.673.667 1.639.264 2.404a.75.75 0 0 1-1.04 1.045a2.2 2.2 0 0 1-1.472.232a.75.75 0 1 1 .302-1.47c.177.037.463-.021.708-.266c.388-.388.286-.775.177-.884s-.496-.21-.884.177c-.784.784-2.138 1.044-3.005.176m-1.126-4.035a2 2 0 1 0-2.828-2.828a2 2 0 0 0 2.828 2.828"></path></svg>}
                />
                <Detail
                  text='Created At'
                  value={getTime("created_at" in s.coinex_position ? s.coinex_position.created_at : s.createdAt)}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6.96 2c.418 0 .756.31.756.692V4.09c.67-.012 1.422-.012 2.268-.012h4.032c.846 0 1.597 0 2.268.012V2.692c0-.382.338-.692.756-.692s.756.31.756.692V4.15c1.45.106 2.403.368 3.103 1.008c.7.641.985 1.513 1.101 2.842v1H2V8c.116-1.329.401-2.2 1.101-2.842c.7-.64 1.652-.902 3.103-1.008V2.692c0-.382.339-.692.756-.692"></path><path fill="currentColor" d="M22 14v-2c0-.839-.013-2.335-.026-3H2.006c-.013.665 0 2.161 0 3v2c0 3.771 0 5.657 1.17 6.828C4.349 22 6.234 22 10.004 22h4c3.77 0 5.654 0 6.826-1.172S22 17.771 22 14" opacity={0.5}></path><path fill="currentColor" fillRule="evenodd" d="M14 12.25A1.75 1.75 0 0 0 12.25 14v2a1.75 1.75 0 1 0 3.5 0v-2A1.75 1.75 0 0 0 14 12.25m0 1.5a.25.25 0 0 0-.25.25v2a.25.25 0 1 0 .5 0v-2a.25.25 0 0 0-.25-.25" clipRule="evenodd"></path><path fill="currentColor" d="M11.25 13a.75.75 0 0 0-1.28-.53l-1.5 1.5a.75.75 0 0 0 1.06 1.06l.22-.22V17a.75.75 0 0 0 1.5 0z"></path></svg>}
                />
                <Detail
                  text='Updated At'
                  value={getTime("updated_at" in s.coinex_position ? s.coinex_position.updated_at : s.createdAt)}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M17 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m.75-7a.75.75 0 0 0-1.5 0v1.846c0 .18.065.355.183.491l1 1.154a.75.75 0 0 0 1.134-.982l-.817-.943z"></path><path d="M1.25 7A.75.75 0 0 1 2 6.25h8a.75.75 0 0 1 0 1.5H2A.75.75 0 0 1 1.25 7m0 5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m0 5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75" opacity={0.5}></path></g></svg>}
                />
              </Box>
            }
          </Stack>
        </Stack>
        <Box sx={{ height: 70 }} />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          m: 'auto',
          width: '100%'
        }}>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TPChip signal={s} />
              <STChip signal={s} />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant='caption' color="text.secondary">
                {s.logs[s.logs.length - 1]?.message}
              </Typography>
              {s.state !== 'pending' && s.state !== 'cancelled' && s.state !== 'finished' && (
                <Button
                  onClick={async () => {
                    if (!s._id) return;
                    setClosing(true);
                    try {
                      await api.delete(`/coinex/close/${s._id}`);
                      setHidden(true);
                    } catch {
                      setClosing(false);
                    }
                  }}
                  disabled={closing}
                  color="error"
                  size="small"
                  variant="contained"
                >
                  {closing ? 'Closing…' : 'Close Position'}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Box>
      </CardContent>
      <SignalLogsDialog open={open} onClose={() => setOpen(false)} logs={s.logs || []} />
    </Card>
  );
}
