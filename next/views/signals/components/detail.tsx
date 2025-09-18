import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function Detail({ icon, text, value, color }: { text: string, value: any, icon: ReactNode, color?: any }) {
    return <Stack direction="row" gap={1} alignItems="center" sx={{ width: '100%' }}>
        <Typography component="span" color={color}>
            {icon}
        </Typography>
        <Typography variant="caption" color={color || "text.secondary"}>
            {text}
        </Typography>
        <Box sx={{ flex: '1 1 auto' }}>
            <Divider />
        </Box>
        <Typography variant="body2" color={color}>
            {value}
        </Typography>
    </Stack>
}