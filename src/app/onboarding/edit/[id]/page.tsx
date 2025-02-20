'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
  Autocomplete,
  Stack,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CreateOfferData } from '@/types/dashboard';
import { getOffers, getUsers } from '@/services/api';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import DashboardLayout from '@/app/dashboard/layout';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateOfferData>({
    type: 'monthly',
    user_id: 0,
    expired_date: '',
    price: 0,
    additions: {
      refundable: false,
      on_demand: false,
      negotiable: false,
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch offer details when component mounts
  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getOffers();
        const offer = response.data.find(o => o.id === Number(params.id));
        
        if (offer) {
          setFormData({
            type: offer.type,
            user_id: offer.id,
            expired_date: '', // You'll need to add this to your offer type
            price: offer.price,
            additions: {
              refundable: false, // You'll need to add these to your offer type
              on_demand: false,
              negotiable: false,
            },
          });
          // Set other form fields...
        } else {
          enqueueSnackbar('Offer not found', { variant: 'error' });
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
        enqueueSnackbar('Failed to fetch offer details', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferDetails();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation here...

    setIsLoading(true);

    try {
      // Add update API call here
      enqueueSnackbar('Offer updated successfully', { variant: 'success' });
      router.push('/onboarding');
    } catch (error) {
      console.error('Error updating offer:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to update offer', { 
        variant: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', pt: 8, px: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Offer
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Update onboarding offer details
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={4}>
            {/* Plan Type */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Plan Type
              </Typography>
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as CreateOfferData['type'] })
                }
              >
                <FormControlLabel
                  value="pay_as_you_go"
                  control={<Radio />}
                  label="Pay As You Go"
                />
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label="Monthly"
                />
                <FormControlLabel
                  value="yearly"
                  control={<Radio />}
                  label="Yearly"
                />
              </RadioGroup>
            </Box>

            {/* Rest of the form fields... */}
            {/* Copy the rest of the form fields from create/page.tsx */}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  bgcolor: 'black',
                  '&:hover': {
                    bgcolor: 'black',
                    opacity: 0.9,
                  },
                  px: 4,
                }}
              >
                {isLoading ? 'Updating...' : 'Update Offer'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </DashboardLayout>
  );
} 