'use client';

import { Box, Container, Typography, Stack, CardContent, Divider, Fade } from '@mui/material';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../lib/i18n';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Privacy section component with Mica styling
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
  const { t } = useI18n();

  const privacySections = [
    {
      icon: <StorageIcon sx={{ color: '#fff' }} />,
      title: t.privacy.sections.collection.title,
      content: t.privacy.sections.collection.content,
    },
    {
      icon: <VisibilityOffIcon sx={{ color: '#fff' }} />,
      title: t.privacy.sections.usage.title,
      content: t.privacy.sections.usage.content,
    },
    {
      icon: <LockIcon sx={{ color: '#fff' }} />,
      title: t.privacy.sections.security.title,
      content: t.privacy.sections.security.content,
    },
    {
      icon: <SecurityIcon sx={{ color: '#fff' }} />,
      title: t.privacy.sections.rights.title,
      content: t.privacy.sections.rights.content,
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
                      <SecurityIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                      {t.privacy.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                      {t.privacy.lastUpdated}: 24 de diciembre de 2025
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                      {t.privacy.intro}
                    </Typography>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Privacy Sections */}
              <GlassCard variant="mica" intensity="subtle">
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
              <GlassCard variant="frosted" intensity="medium">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                      5. {t.footer.contact}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                      {t.privacy.contact}
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
