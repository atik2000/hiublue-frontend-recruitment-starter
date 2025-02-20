'use client';

import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import OfferList from '@/components/dashboard/offer-list';
import DashboardLayout from '../dashboard/layout';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <Box sx={{ mt: 8, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <div>
            <Typography variant="h4" gutterBottom>
              Onboarding
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage onboarding offers
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/onboarding/create')}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'black', opacity: 0.9 } }}
          >
            Create Offer
          </Button>
        </Box>

        <OfferList />
      </Box>
    </DashboardLayout>
  );
}
