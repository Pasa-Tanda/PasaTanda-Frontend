'use client';

import { Box, Divider, Stack, Typography, IconButton, Link as MuiLink } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';

export default function Footer() {
  const { locale } = useI18n();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: locale === 'es' ? 'Producto' : 'Product',
      links: [
        { label: locale === 'es' ? 'Inicio' : 'Home', href: '/' },
        { label: locale === 'es' ? 'Crear Tanda' : 'Create Tanda', href: '/onboarding/verify' },
        { label: locale === 'es' ? 'Pagos' : 'Payments', href: '/pagos' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    resources: {
      title: locale === 'es' ? 'Recursos' : 'Resources',
      links: [
        { label: locale === 'es' ? 'Documentación' : 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'Smart Contracts', href: '/docs/contracts' },
        { label: locale === 'es' ? 'Integraciones' : 'Integrations', href: '/docs/integrations' },
      ],
    },
    legal: {
      title: locale === 'es' ? 'Legal' : 'Legal',
      links: [
        { label: locale === 'es' ? 'Términos de Servicio' : 'Terms of Service', href: '/ToS' },
        { label: locale === 'es' ? 'Política de Privacidad' : 'Privacy Policy', href: '/PP' },
      ],
    },
  };

  const socialLinks = [
    { icon: <GitHubIcon />, href: 'https://github.com/Pasa-Tanda', label: 'GitHub' },
    { icon: <XIcon />, href: 'https://x.com/pasatanda', label: 'X (Twitter)' },
    { icon: <TelegramIcon />, href: 'https://t.me/pasatanda', label: 'Telegram' },
    { icon: <LanguageIcon />, href: 'https://stellar.org', label: 'Stellar' },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 8, 
        borderTop: '1px solid rgba(0,0,0,0.1)', 
        bgcolor: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Main Footer Content */}
      <Box sx={{ px: { xs: 3, sm: 6, md: 8 }, py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack spacing={1.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
                <Image 
                  src="/assets/images/icons/logopasatanda.svg" 
                  alt="PasaTanda" 
                  width={40} 
                  height={40} 
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'var(--font-stack-sans), sans-serif',
                    color: '#000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  PasaTanda
                </Typography>
              </Stack>
            </Link>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(0,0,0,0.6)', 
                mb: 3,
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              {locale === 'es' 
                ? 'Ahorro colaborativo sobre Stellar. Organiza tandas confiables con on/off ramp bancario y contratos inteligentes.'
                : 'Collaborative savings on Stellar. Run trusted ROSCAs with local banking on/off ramps and smart contracts.'}
            </Typography>

            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component={MuiLink}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: '#000',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#000',
                      color: '#fff',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Product Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#000', 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              {footerLinks.product.title}
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.product.links.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'rgba(0,0,0,0.6)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Resources Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#000', 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              {footerLinks.resources.title}
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.resources.links.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'rgba(0,0,0,0.6)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Legal Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#000', 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              {footerLinks.legal.title}
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.legal.links.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'rgba(0,0,0,0.6)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Powered By */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#000', 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              Powered By
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(0,0,0,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#000',
                  },
                }}
              >
                Stellar Network
              </MuiLink>
              <MuiLink
                href="https://soroban.stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(0,0,0,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#000',
                  },
                }}
              >
                Soroban
              </MuiLink>
              <MuiLink
                href="https://docs.blend.capital"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(0,0,0,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#000',
                  },
                }}
              >
                Blend Protocol
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Bar */}
      <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
      <Box sx={{ px: { xs: 3, sm: 6, md: 8 }, py: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
            © {currentYear} PasaTanda. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)' }}>
              Stellar Soroban • Blend Protocol • x402
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
