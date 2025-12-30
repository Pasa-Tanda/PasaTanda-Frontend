'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  CardContent, 
  Button, 
  Avatar,
  Fade,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import Header from '../components/Header';
import { useMounted } from '../lib/useMounted';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { GlassCard } from '../components/GlassCard';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentsIcon from '@mui/icons-material/Payments';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

// Payment method card
function PaymentMethodCard({ 
  icon, 
  title, 
  subtitle, 
  features, 
  dark = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
  features: string[];
  dark?: boolean;
}) {
  return (
    <GlassCard variant="mica" dark={dark} intensity="medium" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Avatar
            sx={{
              bgcolor: dark ? '#fff' : '#000',
              color: dark ? '#000' : '#fff',
              width: 64,
              height: 64,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: dark ? '#fff' : '#000',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            {features.map((feature, idx) => (
              <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: dark ? '#fff' : '#000',
                    flexShrink: 0,
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </GlassCard>
  );
}

// Feature highlight
function FeatureHighlight({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function PagosInfo() {
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
      <ParticleBackground variant="combined" />

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
            <Stack spacing={6}>
              {/* Header */}
              <GlassCard variant="mica" intensity="medium" glow>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={3}>
                        <Chip 
                          label="Métodos de Pago" 
                          sx={{ 
                            width: 'fit-content', 
                            fontWeight: 700, 
                            bgcolor: '#000', 
                            color: '#fff',
                          }} 
                        />
                        <Typography variant="h2" sx={{ fontWeight: 800, color: '#000' }}>
                          Cómo Funcionan los Pagos
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                          PasaTanda ofrece múltiples métodos de pago para tu conveniencia. 
                          Elige entre transferencia bancaria local (QR) o pago directo con tu wallet de Stellar.
                        </Typography>
                        <Button
                          component={Link}
                          href="/pagos/ABC-123"
                          variant="contained"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            width: 'fit-content',
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
                          Ver ejemplo de pago
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Stack spacing={2}>
                        <FeatureHighlight
                          icon={<SpeedIcon sx={{ color: '#000' }} />}
                          title="Rápido"
                          description="Pagos procesados en segundos"
                        />
                        <FeatureHighlight
                          icon={<SecurityIcon sx={{ color: '#000' }} />}
                          title="Seguro"
                          description="Protegido por blockchain"
                        />
                        <FeatureHighlight
                          icon={<PaymentsIcon sx={{ color: '#000' }} />}
                          title="Flexible"
                          description="Múltiples métodos de pago"
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlassCard>

              {/* Payment Methods */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PaymentMethodCard
                    icon={<QrCodeIcon sx={{ fontSize: 32 }} />}
                    title="QR Simple (Bolivianos)"
                    subtitle="Pago con tu app bancaria"
                    features={[
                      'Escanea el código QR con tu app bancaria',
                      'Realiza el pago en bolivianos (BOB)',
                      'Confirma el pago subiendo el comprobante',
                      'Verificación automática o manual',
                    ]}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PaymentMethodCard
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: 32 }} />}
                    title="Stellar Wallet (USDC)"
                    subtitle="Pago directo con crypto"
                    features={[
                      'Conecta tu wallet Freighter',
                      'Firma el XDR challenge de forma segura',
                      'Pago procesado instantáneamente',
                      'Sin intermediarios ni comisiones ocultas',
                    ]}
                    dark
                  />
                </Grid>
              </Grid>

              {/* How it works */}
              <GlassCard variant="mica" intensity="subtle">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={4}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                      Flujo de Pago
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { step: '1', title: 'Recibe el link', desc: 'El bot de WhatsApp te envía un enlace único de pago' },
                        { step: '2', title: 'Elige método', desc: 'Selecciona QR bancario o Stellar Wallet' },
                        { step: '3', title: 'Realiza el pago', desc: 'Completa la transacción según el método elegido' },
                        { step: '4', title: 'Confirmación', desc: 'El sistema verifica y registra tu pago automáticamente' },
                      ].map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.step}>
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              border: '1px solid rgba(0,0,0,0.1)',
                              bgcolor: 'rgba(0,0,0,0.02)',
                              height: '100%',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.05)',
                                transform: 'translateY(-4px)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: '#000',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                mb: 2,
                              }}
                            >
                              {item.step}
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000', mb: 0.5 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                              {item.desc}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* CTA */}
              <GlassCard variant="frosted" dark intensity="medium">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={3}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                        ¿Tienes un link de pago?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Ingresa el ID de tu orden para ir directamente a la página de pago.
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        component={Link}
                        href="/onboarding/verify"
                        variant="contained"
                        sx={{
                          px: 4,
                          py: 1.5,
                          bgcolor: '#fff',
                          color: '#000',
                          borderRadius: 2,
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Crear Tanda
                      </Button>
                      <Button
                        component={Link}
                        href="/docs"
                        variant="outlined"
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          borderWidth: 2,
                          borderColor: 'rgba(255,255,255,0.5)',
                          color: '#fff',
                          fontWeight: 700,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#fff',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Ver Docs
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
