'use client';

import { Box, Button, Container, Stack, Typography, Fade } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticleBackground from '../../components/ParticleBackground';
import { useMounted } from '../../lib/useMounted';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function PaymentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const mounted = useMounted();

  useEffect(() => {
    console.error('Payment Error:', error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
    >
      {/* Particle Background */}
      <ParticleBackground variant="stars" />

      {/* Grid overlay */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, py: 8 }}>
          <Fade in={mounted} timeout={800}>
            <Box
              sx={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack spacing={4} alignItems="center" textAlign="center">
                {/* Icon */}
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    border: '2px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      bgcolor: 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <ReceiptLongIcon sx={{ fontSize: 60, color: '#000' }} />
                </Box>

                {/* Message */}
                <Stack spacing={1}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#000',
                    }}
                  >
                    Orden no válida
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(0,0,0,0.6)',
                      maxWidth: 450,
                    }}
                  >
                    No pudimos encontrar la orden de pago. Es posible que el enlace haya expirado, 
                    sea incorrecto o la orden ya haya sido procesada.
                  </Typography>
                </Stack>

                {/* Tips */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    maxWidth: 400,
                    width: '100%',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#000' }}>
                    ¿Qué puedes hacer?
                  </Typography>
                  <Stack spacing={1.5} alignItems="flex-start">
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                      • Verifica que el enlace sea correcto
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                      • Solicita un nuevo enlace de pago vía WhatsApp
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                      • Contacta al organizador de tu tanda
                    </Typography>
                  </Stack>
                </Box>

                {/* Actions */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    onClick={reset}
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: '#000',
                      borderRadius: 3,
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: '#222',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Reintentar
                  </Button>
                  <Button
                    component={Link}
                    href="/"
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderWidth: 2,
                      borderColor: '#000',
                      color: '#000',
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(0,0,0,0.05)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Ir al Inicio
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        </Container>

        <Footer />
      </Box>
    </Box>
  );
}
