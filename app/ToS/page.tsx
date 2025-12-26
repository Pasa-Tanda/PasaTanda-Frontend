'use client';

import { Box, Container, Typography, Stack } from '@mui/material';
import Header from '../components/Header';

export default function TermsOfService() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
          <Typography variant="h2" component="h1">
            Términos de Servicio
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Última actualización: 24 de diciembre de 2025
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            1. Aceptación de los Términos
          </Typography>
          <Typography variant="body1">
            Al utilizar PasaTanda, aceptas cumplir con estos términos de servicio.
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            2. Descripción del Servicio
          </Typography>
          <Typography variant="body1">
            PasaTanda es una plataforma que facilita la gestión de pagos de Pasanaku utilizando la blockchain de Stellar.
          </Typography>

          <Typography variant="h5" sx={{ mt: 4 }}>
            3. Responsabilidades del Usuario
          </Typography>
          <Typography variant="body1">
            Los usuarios son responsables de mantener la seguridad de sus wallets y claves privadas.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
