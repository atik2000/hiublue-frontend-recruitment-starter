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
import { createOffer, getUsers } from '@/services/api';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import DashboardLayout from '@/app/dashboard/layout';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function CreateOfferPage() {
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (searchTerm.length >= 2) {
          setIsLoading(true);
          const data = await getUsers(searchTerm);
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        enqueueSnackbar('Failed to fetch users', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, enqueueSnackbar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.user_id) {
      enqueueSnackbar('Please select a user', { variant: 'error' });
      return;
    }

    if (!formData.expired_date) {
      enqueueSnackbar('Please select an expiry date', { variant: 'error' });
      return;
    }

    if (!formData.price) {
      enqueueSnackbar('Please enter a price', { variant: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting form data:', formData); // For debugging
      const response = await createOffer(formData);
      console.log('Create offer response:', response); // For debugging
      
      enqueueSnackbar('Offer created successfully', { variant: 'success' });
      router.push('/onboarding');
    } catch (error) {
      console.error('Error creating offer:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to create offer', { 
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
          Create Offer
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Send onboarding offer to new user
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

            {/* Additions */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Additions
              </Typography>
              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.additions.refundable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additions: {
                            ...formData.additions,
                            refundable: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Refundable"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.additions.on_demand}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additions: {
                            ...formData.additions,
                            on_demand: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="On demand"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.additions.negotiable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additions: {
                            ...formData.additions,
                            negotiable: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Negotiable"
                />
              </Stack>
            </Box>

            {/* User Selection */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                User
              </Typography>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                onChange={(_, newValue) => {
                  setSelectedUser(newValue);
                  setFormData({ ...formData, user_id: newValue ? Number(newValue.id) : 0 });
                }}
                onInputChange={(_, value) => setSearchTerm(value)}
                loading={isLoading}
                filterOptions={(x) => x}
                noOptionsText={
                  searchTerm.length < 2 
                    ? "Type at least 2 characters to search" 
                    : "No users found"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search users by name or email..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Expiry Date */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Expired
              </Typography>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  setFormData({
                    ...formData,
                    expired_date: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false,
                  },
                }}
              />
            </Box>

            {/* Price */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Price
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                InputProps={{
                  startAdornment: <Box component="span" mr={1}>$</Box>,
                }}
              />
            </Box>

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
                {isLoading ? 'Creating...' : 'Send Offer'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </DashboardLayout>
  );
} 