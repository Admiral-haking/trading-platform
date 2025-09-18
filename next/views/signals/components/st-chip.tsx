import { Chip } from "@mui/material";
import { Signal } from "../../../types/coinex";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';


function fmt(n: number) {
    const d = Math.abs(n) < 1 ? 4 : 2;
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

export default function TPChip({ signal: { sl_tp_done, coinex_position } }: { signal: Signal }) {

    if (!coinex_position)
        return <Chip icon={<TrendingUpRoundedIcon />} label='TP Pending' size="small" color="default" variant="outlined" />;

    if ("take_profit_price" in coinex_position && parseFloat(coinex_position.take_profit_price))
        return <Chip icon={< TrendingUpRoundedIcon />} label={`TP Added ${fmt(parseFloat(coinex_position.take_profit_price))}`} size="small" color={sl_tp_done ? 'success' : 'default'} variant={sl_tp_done ? 'filled' : 'outlined'} />
    return <Chip icon={<TrendingUpRoundedIcon />} label="TP Set" size="small" color={sl_tp_done ? 'success' : 'default'} variant={sl_tp_done ? 'filled' : 'outlined'} />

}