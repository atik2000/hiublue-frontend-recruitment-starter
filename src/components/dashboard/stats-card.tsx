import { Box, Card, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  total: string;
  percent: number;
  trend: 'up' | 'down';
}

export default function StatsCard({ title, total, percent, trend }: StatsCardProps) {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {total}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trend === 'up' ? 'success.main' : 'error.main',
          }}
        >
          {trend === 'up' ? <ArrowUpward /> : <ArrowDownward />}
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {percent}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        previous month
      </Typography>
    </Card>
  );
} 