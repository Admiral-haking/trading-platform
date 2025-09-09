import React from 'react';
import Image from 'next/image';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import logo from '../../../logo.png';

export default function AboutUs() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              background: (t) =>
                `linear-gradient(135deg, ${t.palette.primary.main}22, ${t.palette.primary.main}11)`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 48, height: 48, position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                  <Image src={logo} alt="Hippogriff" fill style={{ objectFit: 'contain' }} />
                </Box>
                <Box>
                  <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>HIPPOGRIFF</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Hippogriff Engineering</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Software, Hardware, and IoT solutions</Typography>
                </Box>
              </Stack>
              <Chip icon={<LocationOnOutlinedIcon />} label="Mashhad, Iran" variant="outlined" />
            </Stack>
          </Box>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip icon={<CodeOutlinedIcon />} label="Node.js" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
            <Chip icon={<LayersOutlinedIcon />} label="Cross‑Platform" variant="outlined" />
            <Chip icon={<MemoryOutlinedIcon />} label="Hardware" variant="outlined" />
            <Chip icon={<SensorsOutlinedIcon />} label="IoT" variant="outlined" />
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Leadership</Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700 }}>Mohsen Raja'ean</Typography>}
                  secondary={<Typography variant="caption">CTO & CEO</Typography>}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700 }}>Hussain Nazarnejad</Typography>}
                  secondary={<Typography variant="caption">Engineering Lead & SA</Typography>}
                />
              </ListItem>
            </List>
          </Box>

          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            We design and deliver high‑reliability systems end‑to‑end — from backend services and cross‑platform apps to embedded devices and IoT integrations.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

