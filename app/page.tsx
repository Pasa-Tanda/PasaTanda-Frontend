'use client';

import { Box, Container, Stack, Typography, Button } from '@mui/material';
import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md">
        <Stack
          spacing={6}
          sx={{
            py: 8,
            px: { xs: 2, sm: 4 },
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" component="h1">
            PasaTanda
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px' }}>
            Plataforma segura para gestionar pagos de Pasanaku en Stellar
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/pagos"
              sx={{ px: 4, py: 1.5 }}
            >
              Ver Pagos
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/pagos/ABC-123"
              sx={{ px: 4, py: 1.5 }}
            >
              Ejemplo de Pago
            </Button>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ mt: 6 }}>
            <Typography
              component={Link}
              href="/ToS"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Términos de Servicio
            </Typography>
            <Typography
              component={Link}
              href="/PP"
              sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Políticas de Privacidad
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
