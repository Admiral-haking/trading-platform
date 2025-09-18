import { Chip } from "@mui/material";
import { Signal } from "../../../types/coinex";
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';


function fmt(n: number) {
    const d = Math.abs(n) < 1 ? 4 : 2;
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

export default function STChip({ signal: { sl_tp_done, coinex_position } }: { signal: Signal }) {

    if (!coinex_position)
        return <Chip icon={<GppMaybeRoundedIcon />} label='SL Pending' size="small" color="error" variant="outlined" />;

    if ("stop_loss_price" in coinex_position && parseFloat(coinex_position.stop_loss_price))
        return <Chip icon={< GppMaybeRoundedIcon />} label={`SL Added ${fmt(parseFloat(coinex_position.stop_loss_price))}`} size="small" color={sl_tp_done ? 'success' : 'default'} variant={sl_tp_done ? 'filled' : 'outlined'} />
    return <Chip icon={<GppMaybeRoundedIcon />} label="SL Set" size="small" color={sl_tp_done ? 'success' : 'default'} variant={sl_tp_done ? 'filled' : 'outlined'} />

}