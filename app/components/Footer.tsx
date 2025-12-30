'use client';

import { Box, Divider, Stack, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <Box component="footer" sx={{ mt: 8, borderTop: '1px solid rgba(0,0,0,0.1)', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Stack spacing={1.5} direction="row" alignItems="center">
              <Image src="/assets/images/icons/logopasatanda.svg" alt="PasaTanda" width={32} height={32} />
              <Typography
                variant="h6"
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

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button component={Link} href="/docs" variant="text" sx={{ color: 'text.primary' }}>
              {t.nav.docs}
            </Button>
            <Button component={Link} href="/onboarding/verify" variant="text" sx={{ color: 'text.primary' }}>
              {t.nav.onboarding}
            </Button>
            <Button component={Link} href="/pagos" variant="text" sx={{ color: 'text.primary' }}>
              {t.nav.pay}
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} PasaTanda. Stellar Soroban + on/off ramp bancario.
        </Typography>
      </Box>
    </Box>
  );
}
