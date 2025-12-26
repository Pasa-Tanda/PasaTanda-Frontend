'use client';

import { Box, Typography } from '@mui/material';
import { QrCode2 } from '@mui/icons-material';

interface QRPlaceholderProps {
  size?: number;
  text?: string;
}

export default function QRPlaceholder({ 
  size = 250, 
  text = 'QR Code' 
}: QRPlaceholderProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        bgcolor: '#E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: '2px solid #CCCCCC',
        gap: 2,
      }}
    >
      <QrCode2 sx={{ fontSize: 80, color: '#999999' }} />
      <Typography variant="body1" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
