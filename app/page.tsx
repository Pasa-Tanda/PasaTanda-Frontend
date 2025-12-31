'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
  Fade,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useI18n } from './lib/i18n';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

type ValueProp = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

// Glass card component with Mica/Liquid Glass effect
function GlassCard({ children, sx = {}, ...props }: { children: React.ReactNode; sx?: object; [key: string]: unknown }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: 4,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

function ValuePropCard({ title, body, icon }: ValueProp) {
  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 2, color: '#000' }}>{icon}</Box>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {body}
        </Typography>
      </CardContent>
    </GlassCard>
  );
}

function StepCard({ index, text }: { index: number; text: string }) {
  return (
    <GlassCard sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2, px: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(0,0,0,0.9)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            {index}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {text}
          </Typography>
        </Stack>
      </CardContent>
    </GlassCard>
  );
}

export default function Home() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const valuePropsWithIcons = [
    { ...t.valueProps.stellar, icon: <SecurityIcon sx={{ fontSize: 40 }} /> },
    { ...t.valueProps.onramp, icon: <AccountBalanceIcon sx={{ fontSize: 40 }} /> },
    { ...t.valueProps.automation, icon: <WhatsAppIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)',
          },
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: 'fixed',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(80px)',
          top: '10%',
          left: '10%',
          animation: 'float1 20s ease-in-out infinite',
          '@keyframes float1': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(50px, 30px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          filter: 'blur(60px)',
          bottom: '20%',
          right: '15%',
          animation: 'float2 18s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-40px, -50px)' },
          },
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, pb: 8 }}>
          <Stack spacing={10} sx={{ pt: 8 }}>
            {/* Hero Section */}
            <Fade in={mounted} timeout={1000}>
              <Box>
                <GlassCard
                  sx={{
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                    <Grid container spacing={6} alignItems="center">
                      <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={4}>
                          <Chip
                            label="Stellar · Soroban · DeFi"
                            sx={{
                              width: 'fit-content',
                              fontWeight: 700,
                              bgcolor: 'rgba(0,0,0,0.8)',
                              color: '#fff',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.85rem',
                            }}
                          />
                          <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                              maxWidth: 700,
                              fontSize: { xs: '2.5rem', md: '3.5rem' },
                              fontWeight: 800,
                              lineHeight: 1.1,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {t.hero.title}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              maxWidth: 580,
                              color: 'rgba(0,0,0,0.7)',
                              fontWeight: 400,
                              lineHeight: 1.6,
                            }}
                          >
                            {t.hero.subtitle}
                          </Typography>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                              component={Link}
                              href="/onboarding/verify"
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForwardIcon />}
                              sx={{
                                px: 4,
                                py: 1.5,
                                bgcolor: '#000',
                                borderRadius: 3,
                                fontWeight: 700,
                                fontSize: '1rem',
                                '&:hover': {
                                  bgcolor: '#333',
                                  transform: 'scale(1.02)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {t.hero.primaryCta}
                            </Button>
                            <Button
                              component={Link}
                              href="/pagos"
                              variant="outlined"
                              size="large"
                              sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                borderWidth: 2,
                                borderColor: 'rgba(0,0,0,0.8)',
                                color: '#000',
                                fontWeight: 700,
                                '&:hover': {
                                  borderWidth: 2,
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                },
                              }}
                            >
                              {t.hero.secondaryCta}
                            </Button>
                          </Stack>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                            {t.hero.metrics.map((metric) => (
                              <Box
                                key={metric.label}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: 2,
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  border: '1px solid rgba(0,0,0,0.1)',
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
                                  {metric.label}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {metric.value}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <GlassCard
                          sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            p: 4,
                          }}
                        >
                          <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
                            Flujo unificado
                          </Typography>
                          <Stack spacing={2}>
                            {[
                              'Link dinámico /pagos/{id} con QR y XDR',
                              'Firma con Freighter / x402 sin exponer llaves',
                              'Custodia y turnos en contratos Soroban',
                              'Rendimientos automáticos con Blend Protocol',
                            ].map((item, idx) => (
                              <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#4CAF50',
                                    mt: 1,
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </GlassCard>
                      </Grid>
                    </Grid>
                  </CardContent>
                </GlassCard>
              </Box>
            </Fade>

            {/* Value Props */}
            <Fade in={mounted} timeout={1500}>
              <Box>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
                  ¿Por qué PasaTanda?
                </Typography>
                <Grid container spacing={3}>
                  {valuePropsWithIcons.map((item) => (
                    <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                      <ValuePropCard title={item.title} body={item.body} icon={item.icon} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>

            {/* On/Off ramp Section */}
            <Fade in={mounted} timeout={2000}>
              <GlassCard
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Stack spacing={3}>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                      Stellar + On/Off ramp
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        maxWidth: 800,
                        fontSize: '1.1rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {t.valueProps.onramp.body}
                    </Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ pt: 2 }}>
                      {['XDR challenge', 'QR bancario', 'X402 header', 'Soroban contract'].map((label) => (
                        <Chip
                          key={label}
                          label={label}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#000',
                            fontWeight: 700,
                            px: 2,
                            py: 2.5,
                            fontSize: '0.9rem',
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </GlassCard>
            </Fade>

            {/* How it Works */}
            <Fade in={mounted} timeout={2500}>
              <Box>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
                  {t.howItWorks.title}
                </Typography>
                <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                  {t.howItWorks.steps.map((step, idx) => (
                    <StepCard key={step} index={idx + 1} text={step} />
                  ))}
                </Box>
              </Box>
            </Fade>

            {/* FAQ */}
            <Fade in={mounted} timeout={3000}>
              <Box>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
                  {t.faq.title}
                </Typography>
                <Grid container spacing={3}>
                  {t.faq.items.map((item) => (
                    <Grid size={{ xs: 12, md: 6 }} key={item.q}>
                      <GlassCard sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            {item.q}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {item.a}
                          </Typography>
                        </CardContent>
                      </GlassCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>

            {/* Docs CTA */}
            <Fade in={mounted} timeout={3500}>
              <GlassCard>
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Stack
                    spacing={3}
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                        {t.docs.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                        {t.docs.intro}
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        component={Link}
                        href="/docs"
                        variant="contained"
                        sx={{
                          px: 4,
                          py: 1.5,
                          bgcolor: '#000',
                          borderRadius: 3,
                          fontWeight: 700,
                          '&:hover': { bgcolor: '#333' },
                        }}
                      >
                        {t.nav.docs}
                      </Button>
                      <Button
                        component={Link}
                        href="/onboarding/verify"
                        variant="outlined"
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          borderWidth: 2,
                          fontWeight: 700,
                          '&:hover': { borderWidth: 2 },
                        }}
                      >
                        {t.nav.onboarding}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </GlassCard>
            </Fade>
          </Stack>
        </Container>

        <Footer />
      </Box>
    </Box>
  );
}
