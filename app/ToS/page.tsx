'use client';

import { Box, Container, Typography, Stack, CardContent, Divider, Fade } from '@mui/material';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../lib/i18n';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningIcon from '@mui/icons-material/Warning';
import GroupsIcon from '@mui/icons-material/Groups';

// Terms section component with Mica styling
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
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(250,250,255,0.2) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(250,250,255,0.4) 100%)',
          transform: 'translateX(4px)',
          borderColor: 'rgba(0,0,0,0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #000 0%, #333 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
  const { t } = useI18n();

  const termsSections = [
    {
      icon: <GavelIcon sx={{ color: '#fff' }} />,
      title: t.tos.sections.acceptance.title,
      content: t.tos.sections.acceptance.content,
    },
    {
      icon: <DescriptionIcon sx={{ color: '#fff' }} />,
      title: t.tos.sections.description.title,
      content: t.tos.sections.description.content,
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ color: '#fff' }} />,
      title: t.tos.sections.responsibilities.title,
      content: t.tos.sections.responsibilities.items,
    },
    {
      icon: <GroupsIcon sx={{ color: '#fff' }} />,
      title: t.tos.sections.participation.title,
      content: t.tos.sections.participation.content,
    },
    {
      icon: <WarningIcon sx={{ color: '#fff' }} />,
      title: t.tos.sections.liability.title,
      content: t.tos.sections.liability.content,
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

      {/* Grid overlay with subtle mica tint */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)
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
              <GlassCard variant="mica" intensity="medium" glow>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      }}
                    >
                      <GavelIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                      {t.tos.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                      {t.tos.lastUpdated}: 24 de diciembre de 2025
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                      {t.tos.intro}
                    </Typography>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Terms Sections */}
              <GlassCard variant="mica" intensity="subtle">
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
              <GlassCard variant="frosted" intensity="medium">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                      {t.tos.sections.modifications.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                      {t.tos.sections.modifications.content}
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                        {t.tos.contact} <strong>legal@pasatanda.com</strong>
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
