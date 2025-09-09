import React from 'react';
import Link from 'next/link';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Image from 'next/image';
import logo from '../logo.png';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const drawerWidth = 280;

function SidebarContent() {
  return (
    <Box role="navigation" sx={{ width: drawerWidth - 10, height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton component={Link} href="/dashboard">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            secondary="Overview"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/signals">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <TimelineOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Signals"
            secondary="Live stream"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/monitor">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <MonitorHeartOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Monitor"
            secondary="CoinEx queue"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/markets">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <ShowChartOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Markets"
            secondary="Browse prices"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/deposit">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <SavingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Deposit"
            secondary="Fund account"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/transfer">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <SwapHorizOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Transfer"
            secondary="Move funds"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/take-profit">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <TrendingUpOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Take Profit"
            secondary="Targets"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/about">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <PersonOutlineOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="About Me"
            secondary="Profile"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/configs">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Configs"
            secondary="Reconfigure"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/telegram-channels">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <ForumOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Signal Channels"
            secondary="Management"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} href="/telegram-account">
          <ListItemIcon sx={{ color: 'primary.main' }}>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Telegram Account"
            secondary="Re-login"
            secondaryTypographyProps={{ color: 'primary.main', variant: 'caption', sx: { fontWeight: 600, letterSpacing: 0.3 } }}
          />
        </ListItemButton>
      </List>
      <Box sx={{ mt: 'auto', py: 2, display: 'flex', justifyContent: 'center' }}>
        <Image src={logo} alt="Logo" width={140} style={{ opacity: 0.9 }} />
      </Box>
    </Box>
  );
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidebar">
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth }, overflowX: 'hidden' }}
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}

export { drawerWidth };
