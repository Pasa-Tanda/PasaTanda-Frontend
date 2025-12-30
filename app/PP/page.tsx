'use client';

import { Box, Container, Typography, Stack, Card, CardContent, Divider, Fade } from '@mui/material';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

// Privacy section component
function PrivacySection({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: string;
}) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.08)',
        bgcolor: 'rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.04)',
          transform: 'translateX(4px)',
          borderColor: 'rgba(0,0,0,0.15)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
            {content}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function PrivacyPolicy() {
  const mounted = useMounted();

  const privacySections = [
    {
      icon: <StorageIcon sx={{ color: '#fff' }} />,
      title: '1. Información que Recopilamos',
      content: 'PasaTanda minimiza la recopilación de datos personales. No almacenamos información personal sensible. Las direcciones de wallet y transacciones son registradas en la blockchain de Stellar de forma pública y transparente.',
    },
    {
      icon: <VisibilityOffIcon sx={{ color: '#fff' }} />,
      title: '2. Uso de la Información',
      content: 'La información de las transacciones es pública en la blockchain de Stellar y se utiliza únicamente para verificar pagos, gestionar turnos de la tanda y mantener el registro del contrato inteligente.',
    },
    {
      icon: <LockIcon sx={{ color: '#fff' }} />,
      title: '3. Seguridad',
      content: 'Nos comprometemos a proteger la seguridad de tu información mediante el uso de tecnología blockchain y contratos inteligentes auditables. Las llaves privadas nunca son almacenadas en nuestros servidores.',
    },
    {
      icon: <SecurityIcon sx={{ color: '#fff' }} />,
      title: '4. Tus Derechos',
      content: 'Tienes derecho a acceder, rectificar y eliminar tus datos personales (cuando no estén en blockchain). Para ejercer estos derechos, contacta a nuestro equipo de soporte.',
    },
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

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
          <Fade in={mounted} timeout={600}>
            <Stack spacing={4}>
              {/* Header */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SecurityIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                      Políticas de Privacidad
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                      Última actualización: 24 de diciembre de 2025
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                      En PasaTanda, valoramos tu privacidad y nos comprometemos a proteger tus datos. 
                      Esta política describe cómo recopilamos, usamos y protegemos tu información.
                    </Typography>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Privacy Sections */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    {privacySections.map((section) => (
                      <PrivacySection
                        key={section.title}
                        icon={section.icon}
                        title={section.title}
                        content={section.content}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Contact */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                      5. Contacto
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                      Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, 
                      puedes contactarnos a través de nuestro canal de WhatsApp o por correo electrónico.
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'monospace' }}>
                        Email: soporte@pasatanda.com
                      </Typography>
                    </Box>
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
