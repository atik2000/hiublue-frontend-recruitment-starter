import { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Icon } from '@mui/material';

interface IconifyProps extends BoxProps {
  icon?: React.ReactNode;
  width?: number;
  height?: number;
}

const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = 20, height = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={Icon}
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      {icon}
    </Box>
  )
);

Iconify.displayName = 'Iconify';

export default Iconify;
