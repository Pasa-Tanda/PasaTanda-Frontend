'use client';

import { Box, Container, Typography, Stack, Card, CardContent } from '@mui/material';
import Header from '../components/Header';

export default function PagosInfo() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
          <Typography variant="h2" component="h1">
            Cómo Funcionan los Pagos
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            PasaTanda ofrece dos métodos de pago para tu conveniencia.
          </Typography>

          <Card elevation={0} sx={{ bgcolor: 'background.paper', mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                1. QRsimple (Bolivianos - Bs)
              </Typography>
              <Typography variant="body1">
                Escanea el código QR con tu aplicación bancaria y realiza el pago en bolivianos. Una vez completado, confirma el pago en la plataforma.
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                2. Stellar Wallet (USDC)
              </Typography>
              <Typography variant="body1">
                Conecta tu wallet de Stellar y paga directamente en USDC. La transacción se verifica automáticamente en la blockchain.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
