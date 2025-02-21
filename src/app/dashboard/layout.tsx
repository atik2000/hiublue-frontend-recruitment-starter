'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isMobile && <Sidebar />}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          pt: { xs: 8, sm: 9 }, // Adjust top padding for header
          pb: 3,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Header />
        <Container 
          maxWidth="xl" 
          sx={{ 
            mt: 3,
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
} 