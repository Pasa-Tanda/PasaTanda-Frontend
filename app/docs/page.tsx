'use client';

import { 
  Box, 
  Card, 
  CardContent, 
  Container, 
  Stack, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Chip,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Link from 'next/link';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useI18n } from '../lib/i18n';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import ApiIcon from '@mui/icons-material/Api';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

// Glass card component
function GlassCard({ children, sx = {}, ...props }: { children: React.ReactNode; sx?: object; [key: string]: unknown }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

// API Endpoint component
function ApiEndpoint({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors: Record<string, string> = {
    GET: 'rgba(0, 200, 83, 0.15)',
    POST: 'rgba(33, 150, 243, 0.15)',
    PUT: 'rgba(255, 152, 0, 0.15)',
    DELETE: 'rgba(244, 67, 54, 0.15)',
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.08)',
        bgcolor: 'rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.04)',
          transform: 'translateX(4px)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          label={method}
          size="small"
          sx={{
            fontWeight: 700,
            fontFamily: 'monospace',
            bgcolor: methodColors[method] || 'rgba(0,0,0,0.1)',
            color: '#000',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            color: '#000',
          }}
        >
          {path}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(0,0,0,0.6)' }}>
        {description}
      </Typography>
    </Box>
  );
}

export default function DocsPage() {
  const { t } = useI18n();
  const mounted = useMounted();

  const apiEndpoints = [
    { method: 'GET', path: '/api/orders/:id', description: 'Obtener detalles de una orden de pago (QR, XDR, estado)' },
    { method: 'POST', path: '/api/orders/:id/claim', description: 'Confirmar un pago (fiat o crypto)' },
    { method: 'GET', path: '/api/onboarding/verify', description: 'Solicitar código de verificación telefónica' },
    { method: 'POST', path: '/api/onboarding', description: 'Crear una nueva tanda (estado DRAFT)' },
    { method: 'GET', path: '/api/pay', description: 'Discovery de métodos de pago disponibles' },
  ];

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

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
          <Fade in={mounted} timeout={600}>
            <Stack spacing={4}>
              {/* Header Card */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          bgcolor: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CodeIcon sx={{ color: '#fff', fontSize: 28 }} />
                      </Box>
                      <Chip label="Documentation" sx={{ fontWeight: 700, bgcolor: 'rgba(0,0,0,0.08)' }} />
                    </Stack>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                      {t.docs.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', maxWidth: 800, fontSize: '1.1rem', lineHeight: 1.7 }}>
                      {t.docs.intro}
                    </Typography>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* API Reference */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ApiIcon sx={{ color: '#000' }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                        API Reference (AgentBE)
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                      Endpoints principales para integrar con PasaTanda. Base URL: <code>NEXT_PUBLIC_AGENT_BE_URL</code>
                    </Typography>
                    <Stack spacing={2}>
                      {apiEndpoints.map((endpoint) => (
                        <ApiEndpoint
                          key={`${endpoint.method}-${endpoint.path}`}
                          method={endpoint.method}
                          path={endpoint.path}
                          description={endpoint.description}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Documentation Sections */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IntegrationInstructionsIcon sx={{ color: '#000' }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                        Guías de Integración
                      </Typography>
                    </Stack>

                    {t.docs.sections.map((section, idx) => (
                      <Accordion
                        key={section.title}
                        defaultExpanded={idx === 0}
                        sx={{
                          bgcolor: 'transparent',
                          boxShadow: 'none',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '12px !important',
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': {
                            margin: 0,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.02)',
                            },
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                            {section.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {section.items.map((item) => (
                              <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                                <ListItemText 
                                  primary={item} 
                                  primaryTypographyProps={{ 
                                    color: 'rgba(0,0,0,0.7)',
                                    sx: { 
                                      '&:before': { 
                                        content: '"→"', 
                                        mr: 1.5,
                                        color: '#000',
                                      } 
                                    }
                                  }} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* CTA */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={3}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                        ¿Listo para comenzar?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                        Crea tu primera tanda o prueba el flujo de pagos.
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button 
                        component={Link} 
                        href="/onboarding/verify" 
                        variant="contained"
                        sx={{
                          px: 3,
                          py: 1.5,
                          bgcolor: '#000',
                          borderRadius: 2,
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: '#222',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {t.nav.onboarding}
                      </Button>
                      <Button 
                        component={Link} 
                        href="/pagos" 
                        variant="outlined"
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
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
                        {t.nav.pay}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </GlassCard>
            </Stack>
          </Fade>
        </Container>

        <Footer />
      </Box>
    </Box>
  );
}
