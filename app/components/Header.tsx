'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';
import LanguageSwitch from './LanguageSwitch';

const navLinks = [
  { href: '/', key: 'home' as const },
  { href: '/pagos', key: 'pay' as const },
  { href: '/onboarding/verify', key: 'onboarding' as const },
  { href: '/docs', key: 'docs' as const },
];

export default function Header() {
  const { t } = useI18n();

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        px: { xs: 2, sm: 4 },
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(255,255,255,0.7)',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Image
              src="/assets/images/icons/logopasatanda.svg"
              alt="PasaTanda"
              width={40}
              height={40}
              priority
              style={{ objectFit: 'contain' }}
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

        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
          {navLinks.map((item) => (
            <Button
              key={item.key}
              component={Link}
              href={item.href}
              variant="text"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {t.nav[item.key]}
            </Button>
          ))}
          <LanguageSwitch />
        </Stack>
      </Stack>
    </Box>
  );
}
