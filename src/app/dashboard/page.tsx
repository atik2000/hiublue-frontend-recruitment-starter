'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import StatsCard from '@/components/dashboard/stats-card';
import OfferList from '@/components/dashboard/offer-list';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
  // Website visits chart options
  const visitsChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    colors: ['#2065D1', '#54D62C'],
    legend: {
      position: 'top',
    },
  };

  // Offers sent chart options
  const offersChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    colors: ['#2065D1'],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total active users"
            total="8.2k"
            percent={8.2}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total clicks"
            total="8.2k"
            percent={8.2}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total appearances"
            total="8.2k"
            percent={8.2}
            trend="down"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Website visits
            </Typography>
            <Chart
              type="bar"
              height={350}
              options={visitsChartOptions}
              series={[
                {
                  name: 'Desktop',
                  data: [40, 60, 25, 45, 45, 45, 80],
                },
                {
                  name: 'Mobile',
                  data: [30, 45, 35, 35, 20, 10, 50],
                },
              ]}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Offers sent
            </Typography>
            <Chart
              type="line"
              height={350}
              options={offersChartOptions}
              series={[
                {
                  name: 'Offers',
                  data: [15, 25, 30, 45, 60, 70, 65],
                },
              ]}
            />
          </Paper>
        </Grid>

        {/* Offer List */}
        <Grid item xs={12}>
          <OfferList />
        </Grid>
      </Grid>
    </Box>
  );
} 