'use client';

import { Box, Container, Typography, Stack, Card, CardContent, Divider, Fade } from '@mui/material';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningIcon from '@mui/icons-material/Warning';
import GroupsIcon from '@mui/icons-material/Groups';

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

// Terms section component
function TermsSection({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: string | string[];
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
          {Array.isArray(content) ? (
            <Stack spacing={1}>
              {content.map((item, idx) => (
                <Typography key={idx} variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                  • {item}
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
              {content}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default function TermsOfService() {
  const mounted = useMounted();

  const termsSections = [
    {
      icon: <GavelIcon sx={{ color: '#fff' }} />,
      title: '1. Aceptación de los Términos',
      content: 'Al utilizar PasaTanda, aceptas cumplir con estos términos de servicio y todas las leyes aplicables. Si no estás de acuerdo con alguno de estos términos, no debes usar la plataforma.',
    },
    {
      icon: <DescriptionIcon sx={{ color: '#fff' }} />,
      title: '2. Descripción del Servicio',
      content: 'PasaTanda es una plataforma que facilita la gestión de tandas (ROSCA/Pasanaku) utilizando la blockchain de Stellar. Proporcionamos herramientas para organizar grupos, gestionar pagos y automatizar la distribución de fondos.',
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ color: '#fff' }} />,
      title: '3. Responsabilidades del Usuario',
      content: [
        'Mantener la seguridad de sus wallets y claves privadas',
        'Proporcionar información veraz durante el registro',
        'Cumplir con los pagos acordados dentro del grupo',
        'No utilizar la plataforma para actividades ilegales',
      ],
    },
    {
      icon: <GroupsIcon sx={{ color: '#fff' }} />,
      title: '4. Participación en Tandas',
      content: 'Al unirte a una tanda, te comprometes a realizar los pagos según el calendario establecido. El incumplimiento puede resultar en la pérdida de tu turno y restricciones en la plataforma.',
    },
    {
      icon: <WarningIcon sx={{ color: '#fff' }} />,
      title: '5. Limitación de Responsabilidad',
      content: 'PasaTanda actúa únicamente como facilitador tecnológico. No somos responsables de disputas entre participantes, pérdidas por errores de usuario o fluctuaciones en el valor de activos digitales.',
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
                      <GavelIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                      Términos de Servicio
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                      Última actualización: 24 de diciembre de 2025
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                      Estos términos de servicio regulan el uso de la plataforma PasaTanda. 
                      Por favor, léelos cuidadosamente antes de utilizar nuestros servicios.
                    </Typography>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Terms Sections */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    {termsSections.map((section) => (
                      <TermsSection
                        key={section.title}
                        icon={section.icon}
                        title={section.title}
                        content={section.content}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Modifications */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                      6. Modificaciones
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                      Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                      Los cambios entrarán en vigor al ser publicados en la plataforma. 
                      El uso continuado del servicio después de las modificaciones constituye la aceptación de los nuevos términos.
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                        Para consultas sobre estos términos, contacta a: <strong>legal@pasatanda.com</strong>
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
