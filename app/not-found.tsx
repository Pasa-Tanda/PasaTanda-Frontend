'use client';

import { Box, Button, Container, Stack, Typography, Fade } from '@mui/material';
import Link from 'next/link';
import Header from './components/Header';
import { useMounted } from './lib/useMounted';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function NotFound() {
  const mounted = useMounted();

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
                  <SearchOffIcon sx={{ fontSize: 60, color: '#000' }} />
                </Box>

                {/* Error Code */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '6rem', md: '8rem' },
                    fontWeight: 900,
                    color: '#000',
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                  }}
                >
                  404
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
                    Página no encontrada
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(0,0,0,0.6)',
                      maxWidth: 400,
                    }}
                  >
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                  </Typography>
                </Stack>

                {/* Actions */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    href="/"
                    variant="contained"
                    startIcon={<HomeIcon />}
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
                    Ir al Inicio
                  </Button>
                  <Button
                    component={Link}
                    href="/docs"
                    variant="outlined"
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
                    Ver Documentación
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
