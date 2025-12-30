'use client';

import { Box, Button, Container, Stack, Typography, Fade } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import { useMounted } from './lib/useMounted';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const mounted = useMounted();

  useEffect(() => {
    // Log error to console in development
    console.error('Application Error:', error);
  }, [error]);

  return (
    <html>
      <body>
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
                        bgcolor: 'rgba(255,0,0,0.05)',
                        border: '2px solid rgba(255,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <ErrorOutlineIcon sx={{ fontSize: 60, color: '#c00' }} />
                    </Box>

                    {/* Error Code */}
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '4rem', md: '5rem' },
                        fontWeight: 900,
                        color: '#000',
                        lineHeight: 1,
                        letterSpacing: '-0.05em',
                      }}
                    >
                      Error
                    </Typography>

                    {/* Message */}
                    <Stack spacing={1}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#000',
                        }}
                      >
                        Algo salió mal
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(0,0,0,0.6)',
                          maxWidth: 400,
                        }}
                      >
                        Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
                      </Typography>
                      {error.digest && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(0,0,0,0.4)',
                            fontFamily: 'monospace',
                          }}
                        >
                          Error ID: {error.digest}
                        </Typography>
                      )}
                    </Stack>

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
                        Intentar de nuevo
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
      </body>
    </html>
  );
}
