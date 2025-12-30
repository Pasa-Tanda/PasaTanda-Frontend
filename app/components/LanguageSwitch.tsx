'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useI18n } from '../lib/i18n';

export default function LanguageSwitch() {
  const { locale, setLocale } = useI18n();

  return (
    <ToggleButtonGroup
      value={locale}
      exclusive
      onChange={(_, value) => value && setLocale(value)}
      size="small"
      sx={{ borderRadius: 2, backgroundColor: 'background.paper' }}
    >
      <ToggleButton value="es" sx={{ px: 1.5 }}>ES</ToggleButton>
      <ToggleButton value="en" sx={{ px: 1.5 }}>EN</ToggleButton>
    </ToggleButtonGroup>
  );
}
