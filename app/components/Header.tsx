'use client';

import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        py: 3,
        px: { xs: 2, sm: 4 },
        borderBottom: '1px solid #E0E0E0',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="flex-start">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image
            src="/assets/images/icons/logotandapaso.png"
            alt="PasaTanda"
            width={180}
            height={40}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </Stack>
    </Box>
  );
}
