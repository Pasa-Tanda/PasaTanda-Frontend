'use client';

import { Box, Container, Typography, Stack } from '@mui/material';
import Header from '../components/Header';

export default function PrivacyPolicy() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
          <Typography variant="h2" component="h1">
            Políticas de Privacidad
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Última actualización: 24 de diciembre de 2025
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            1. Información que Recopilamos
          </Typography>
          <Typography variant="body1">
            PasaTanda no almacena información personal. Todas las transacciones son registradas en la blockchain de Stellar.
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            2. Uso de la Información
          </Typography>
          <Typography variant="body1">
            La información de las transacciones es pública en la blockchain de Stellar y se utiliza únicamente para verificar pagos.
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            3. Seguridad
          </Typography>
          <Typography variant="body1">
            Nos comprometemos a proteger la seguridad de tu información mediante el uso de tecnología blockchain.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
