import React from 'react';
import { Box, Skeleton, Grid, Paper } from '@mui/material';

const LoadingSkeleton: React.FC = () => {
  return (
    <Paper sx={{ p: 4, width: '100%', borderRadius: 2 }} elevation={2}>
      {/* Title */}
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
      
      {/* Dynamic Grid Layout */}
      <Grid container spacing={3}>
        {Array.from(new Array(6)).map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6 }} key={idx}>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>

      {/* Textarea Placeholder */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
      </Box>
    </Paper>
  );
};

export default LoadingSkeleton;
