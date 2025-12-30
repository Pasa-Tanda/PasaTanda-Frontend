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
  Tab,
  Tabs,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useState, SyntheticEvent } from 'react';
import Image from 'next/image';
import { useMounted } from './lib/useMounted';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import { useI18n } from './lib/i18n';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';

type ValueProp = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

// Glass card component with monochrome theme
function GlassCard({ children, sx = {}, dark = false, ...props }: { children: React.ReactNode; sx?: object; dark?: boolean; [key: string]: unknown }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: dark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: dark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: dark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          transform: 'translateY(-8px)',
          boxShadow: dark 
            ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
            : '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: dark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
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
        <Box 
          sx={{ 
            mb: 3, 
            color: '#000',
            width: 64,
            height: 64,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {body}
        </Typography>
      </CardContent>
    </GlassCard>
  );
}

function StepCard({ index, text }: { index: number; text: string }) {
  return (
    <GlassCard sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2.5, px: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.3rem',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {index}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.05rem' }}>
            {text}
          </Typography>
        </Stack>
      </CardContent>
    </GlassCard>
  );
}

// LATAM Countries data
const latamCountries = [
  { 
    code: 'BO', 
    name: 'Bolivia', 
    flag: '🇧🇴', 
    currency: 'BOB',
    methods: [
      { name: 'QR Simple', icon: <QrCodeIcon />, description: 'Pago instantáneo vía QR bancario' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
  { 
    code: 'PE', 
    name: 'Perú', 
    flag: '🇵🇪', 
    currency: 'PEN',
    methods: [
      { name: 'Yape', icon: <QrCodeIcon />, description: 'Transferencia móvil' },
      { name: 'Plin', icon: <CreditCardIcon />, description: 'Pago entre bancos' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
  { 
    code: 'MX', 
    name: 'México', 
    flag: '🇲🇽', 
    currency: 'MXN',
    methods: [
      { name: 'SPEI', icon: <AccountBalanceIcon />, description: 'Transferencia bancaria' },
      { name: 'CoDi', icon: <QrCodeIcon />, description: 'Cobro Digital QR' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
  { 
    code: 'AR', 
    name: 'Argentina', 
    flag: '🇦🇷', 
    currency: 'ARS',
    methods: [
      { name: 'Mercado Pago', icon: <CreditCardIcon />, description: 'Billetera digital' },
      { name: 'Transferencia CBU', icon: <AccountBalanceIcon />, description: 'Transferencia bancaria' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
  { 
    code: 'CO', 
    name: 'Colombia', 
    flag: '🇨🇴', 
    currency: 'COP',
    methods: [
      { name: 'PSE', icon: <AccountBalanceIcon />, description: 'Pagos seguros en línea' },
      { name: 'Nequi', icon: <CreditCardIcon />, description: 'Billetera móvil' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
  { 
    code: 'CL', 
    name: 'Chile', 
    flag: '🇨🇱', 
    currency: 'CLP',
    methods: [
      { name: 'Webpay', icon: <CreditCardIcon />, description: 'Pago con tarjeta' },
      { name: 'Khipu', icon: <AccountBalanceIcon />, description: 'Transferencia bancaria' },
      { name: 'Stellar USDC', icon: <AccountBalanceWalletIcon />, description: 'Wallet crypto (Freighter)' },
    ]
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CountryTabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`country-tabpanel-${index}`}
      aria-labelledby={`country-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const { t, locale } = useI18n();
  const mounted = useMounted();
  const [countryTab, setCountryTab] = useState(0);

  const handleCountryChange = (_event: SyntheticEvent, newValue: number) => {
    setCountryTab(newValue);
  };

  const valuePropsWithIcons = [
    { ...t.valueProps.stellar, icon: <SecurityIcon sx={{ fontSize: 36 }} /> },
    { ...t.valueProps.onramp, icon: <AccountBalanceIcon sx={{ fontSize: 36 }} /> },
    { ...t.valueProps.automation, icon: <WhatsAppIcon sx={{ fontSize: 36 }} /> },
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
      <ParticleBackground variant="combined" />

      {/* Subtle grid pattern overlay */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, pb: 8 }}>
          <Stack spacing={12} sx={{ pt: 8 }}>
            {/* Hero Section */}
            <Fade in={mounted} timeout={800}>
              <Box>
                <GlassCard>
                  <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                    <Grid container spacing={6} alignItems="center">
                      <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={4}>
                          <Chip
                            label="Stellar · Soroban · DeFi"
                            sx={{
                              width: 'fit-content',
                              fontWeight: 700,
                              bgcolor: '#000',
                              color: '#fff',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.85rem',
                              '&:hover': {
                                bgcolor: '#222',
                              },
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
                              color: '#000',
                            }}
                          >
                            {t.hero.title}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              maxWidth: 580,
                              color: 'rgba(0,0,0,0.6)',
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
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  bgcolor: '#222',
                                  transform: 'scale(1.02) translateY(-2px)',
                                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                },
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
                                borderColor: '#000',
                                color: '#000',
                                fontWeight: 700,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  borderWidth: 2,
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  transform: 'translateY(-2px)',
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
                                  px: 2.5,
                                  py: 1.5,
                                  borderRadius: 2,
                                  bgcolor: 'rgba(0,0,0,0.03)',
                                  border: '1px solid rgba(0,0,0,0.08)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.06)',
                                    transform: 'translateY(-2px)',
                                  },
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(0,0,0,0.5)' }}>
                                  {metric.label}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#000' }}>
                                  {metric.value}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <GlassCard dark>
                          <CardContent sx={{ p: 4 }}>
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
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      bgcolor: '#fff',
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
                          </CardContent>
                        </GlassCard>
                      </Grid>
                    </Grid>
                  </CardContent>
                </GlassCard>
              </Box>
            </Fade>

            {/* LATAM Countries Payment Methods Panel */}
            <Fade in={mounted} timeout={1000}>
              <Box>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textAlign: 'center', color: '#000' }}>
                  Métodos de Pago por País
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'rgba(0,0,0,0.6)', maxWidth: 600, mx: 'auto' }}>
                  PasaTanda soporta múltiples métodos de pago locales en Latinoamérica, además de USDC en Stellar.
                </Typography>
                <GlassCard>
                  <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Tabs
                      value={countryTab}
                      onChange={handleCountryChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        '& .MuiTab-root': {
                          minHeight: 64,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: 'rgba(0,0,0,0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#000',
                            bgcolor: 'rgba(0,0,0,0.03)',
                          },
                          '&.Mui-selected': {
                            color: '#000',
                          },
                        },
                        '& .MuiTabs-indicator': {
                          bgcolor: '#000',
                          height: 3,
                        },
                      }}
                    >
                      {latamCountries.map((country) => (
                        <Tab
                          key={country.code}
                          label={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontSize: '1.5rem' }}>{country.flag}</Typography>
                              <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>{country.name}</Typography>
                            </Stack>
                          }
                        />
                      ))}
                    </Tabs>
                    {latamCountries.map((country, index) => (
                      <CountryTabPanel key={country.code} value={countryTab} index={index}>
                        <Stack spacing={3}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ fontSize: '2.5rem' }}>{country.flag}</Typography>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                                {country.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                                Moneda local: {country.currency}
                              </Typography>
                            </Box>
                          </Stack>
                          <Grid container spacing={2}>
                            {country.methods.map((method) => (
                              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={method.name}>
                                <Box
                                  sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    bgcolor: 'rgba(0,0,0,0.02)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'rgba(0,0,0,0.05)',
                                      transform: 'translateY(-4px)',
                                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                      border: '1px solid rgba(0,0,0,0.2)',
                                    },
                                  }}
                                >
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                      sx={{
                                        bgcolor: '#000',
                                        color: '#fff',
                                        width: 48,
                                        height: 48,
                                      }}
                                    >
                                      {method.icon}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000' }}>
                                        {method.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                                        {method.description}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      </CountryTabPanel>
                    ))}
                  </CardContent>
                </GlassCard>
              </Box>
            </Fade>

            {/* Value Props */}
            <Fade in={mounted} timeout={1200}>
              <Box>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center', color: '#000' }}>
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
            <Fade in={mounted} timeout={1400}>
              <GlassCard dark>
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={3}>
                        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                          Stellar + On/Off ramp
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                          }}
                        >
                          {t.valueProps.onramp.body}
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                          {['XDR challenge', 'QR bancario', 'X402 header', 'Soroban contract'].map((label) => (
                            <Chip
                              key={label}
                              label={label}
                              sx={{
                                bgcolor: '#fff',
                                color: '#000',
                                fontWeight: 700,
                                px: 2,
                                py: 2.5,
                                fontSize: '0.9rem',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  transform: 'scale(1.05)',
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 280,
                          borderRadius: 3,
                          overflow: 'hidden',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          src="/assets/images/placeholders/stellar-flow.svg"
                          alt="Stellar Flow"
                          width={300}
                          height={200}
                          style={{ objectFit: 'contain', opacity: 0.9 }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <Typography
                          sx={{
                            position: 'absolute',
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '0.85rem',
                            bottom: 16,
                            textAlign: 'center',
                          }}
                        >
                          Diagrama de flujo Stellar
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlassCard>
            </Fade>

            {/* How it Works */}
            <Fade in={mounted} timeout={1600}>
              <Box>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center', color: '#000' }}>
                  {t.howItWorks.title}
                </Typography>
                <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                  {t.howItWorks.steps.map((step, idx) => (
                    <StepCard key={step} index={idx + 1} text={step} />
                  ))}
                </Box>
              </Box>
            </Fade>

            {/* FAQ Link Section */}
            <Fade in={mounted} timeout={1800}>
              <GlassCard>
                <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#000' }}>
                    {t.faq.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', mb: 3 }}>
                    {locale === 'es' 
                      ? '¿Tienes dudas? Consulta nuestras preguntas frecuentes.'
                      : 'Have questions? Check out our frequently asked questions.'}
                  </Typography>
                  <Button
                    component={Link}
                    href="/faq"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      bgcolor: '#000',
                      color: '#fff',
                      borderRadius: 2,
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: '#222',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    {locale === 'es' ? 'Ver FAQ' : 'View FAQ'}
                  </Button>
                </CardContent>
              </GlassCard>
            </Fade>

            {/* Docs CTA */}
            <Fade in={mounted} timeout={2000}>
              <GlassCard>
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Stack
                    spacing={3}
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#000' }}>
                        {t.docs.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', maxWidth: 600 }}>
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
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: '#222',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                          },
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
