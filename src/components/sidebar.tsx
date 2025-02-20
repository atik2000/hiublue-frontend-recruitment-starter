'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { title: 'Onboarding', path: '/onboarding', icon: PeopleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          priority
        />
      </Box>

      <List>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={pathname.startsWith(item.path)}
                onClick={() => router.push(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.lighter',
                    '&:hover': {
                      backgroundColor: 'primary.lighter',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon
                    sx={{
                      color: pathname.startsWith(item.path)
                        ? 'primary.main'
                        : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: pathname.startsWith(item.path)
                      ? 'primary.main'
                      : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
} 