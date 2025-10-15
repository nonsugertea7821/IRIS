import { Box, styled, Theme } from '@mui/material';

export const CustomBox = styled(Box)(({ theme }: { theme: Theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));
