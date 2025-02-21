'use client';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Chip,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { OfferListItem } from '@/types/dashboard';
import { getOffers, deleteOffer } from '@/services/api';
import { useSnackbar } from 'notistack';
import { useDebounce } from '@/hooks/useDebounce';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const statusColors = {
  accepted: 'success',
  rejected: 'error',
  pending: 'warning',
} as const;

export default function OfferList() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 500);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, offerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedOffer(offerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOffer(null);
  };

  const handleEdit = (offerId: number) => {
    handleMenuClose();
    router.push(`/onboarding/edit/${offerId}`);
  };

  const handleDelete = async (offerId: number) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      handleMenuClose();
      return;
    }

    try {
      setIsLoading(true);
      await deleteOffer(offerId);
      enqueueSnackbar('Offer deleted successfully', { variant: 'success' });
      fetchOffers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting offer:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to delete offer', 
        { variant: 'error' }
      );
    } finally {
      setIsLoading(false);
      handleMenuClose();
    }
  };

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await getOffers({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
        type: filterType === 'all' ? undefined : filterType,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setOffers(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Error fetching offers:', error);
      enqueueSnackbar('Failed to fetch offers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page, rowsPerPage, debouncedSearch, filterType, statusFilter]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        overflowX: 'auto'
      }}>
        <Tabs 
          value={statusFilter} 
          onChange={(_, newValue) => setStatusFilter(newValue)}
          sx={{ 
            px: { xs: 1, sm: 2 },
            minHeight: 48
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Accepted" value="accepted" />
        </Tabs>
      </Box>

      <Box sx={{ 
        p: { xs: 1, sm: 2 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2 
      }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            width: { xs: '100%', sm: 200 }
          }}
        />
        <TextField
          select
          size="small"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ 
            width: { xs: '100%', sm: 120 }
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
          <MenuItem value="pay_as_you_go">Pay As You Go</MenuItem>
        </TextField>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Phone number</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Company</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Job Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No offers found
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{offer.user_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {offer.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{offer.phone}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{offer.company}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{offer.jobTitle}</TableCell>
                  <TableCell>{offer.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={offer.status}
                      color={statusColors[offer.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, offer.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            display: { xs: 'none', sm: 'block' }
          }
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MuiMenuItem onClick={() => selectedOffer && handleEdit(selectedOffer)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MuiMenuItem>
        <MuiMenuItem 
          onClick={() => selectedOffer && handleDelete(selectedOffer)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MuiMenuItem>
      </Menu>
    </Paper>
  );
} 