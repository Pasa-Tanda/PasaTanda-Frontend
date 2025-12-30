'use client';

import { Card, CardProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

/**
 * GlassCard Component - Mica Material / Liquid Glass Style
 * 
 * Inspired by Windows 11 Mica Material and macOS Liquid Glass effects.
 * Features:
 * - Multi-layer glass effect with subtle tinting
 * - Dynamic blur that responds to background
 * - Luminous borders with gradient highlights
 * - Smooth transitions and hover states
 * - Dark mode variant support
 */

export type GlassVariant = 'default' | 'mica' | 'acrylic' | 'frosted';

// Base props without conflict with CardProps variant
export interface GlassCardBaseProps {
  children: ReactNode;
  dark?: boolean;
  variant?: GlassVariant;
  intensity?: 'subtle' | 'medium' | 'strong';
  glow?: boolean;
  animated?: boolean;
  sx?: SxProps<Theme>;
}

// Combined props that accept any additional props (for component prop usage)
export type GlassCardProps = GlassCardBaseProps & Omit<CardProps, 'variant'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// Mica Material effect - Windows 11 style with tinted glass
const getMicaStyles = (dark: boolean, intensity: 'subtle' | 'medium' | 'strong') => {
  const opacityMap = {
    subtle: { bg: dark ? 0.6 : 0.75, border: 0.08 },
    medium: { bg: dark ? 0.7 : 0.85, border: 0.12 },
    strong: { bg: dark ? 0.8 : 0.92, border: 0.15 },
  };
  const { bg, border } = opacityMap[intensity];

  return {
    background: dark 
      ? `linear-gradient(135deg, 
          rgba(30, 30, 30, ${bg}) 0%, 
          rgba(20, 20, 25, ${bg}) 50%,
          rgba(25, 25, 30, ${bg}) 100%)`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, ${bg}) 0%, 
          rgba(250, 250, 255, ${bg}) 50%,
          rgba(255, 255, 255, ${bg}) 100%)`,
    backdropFilter: 'blur(40px) saturate(180%) brightness(105%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(105%)',
    border: dark 
      ? `1px solid rgba(255, 255, 255, ${border})`
      : `1px solid rgba(0, 0, 0, ${border})`,
    boxShadow: dark
      ? `0 0 0 1px rgba(255, 255, 255, 0.03) inset,
         0 1px 0 rgba(255, 255, 255, 0.05) inset,
         0 -1px 0 rgba(0, 0, 0, 0.2) inset,
         0 8px 32px rgba(0, 0, 0, 0.35)`
      : `0 0 0 1px rgba(255, 255, 255, 0.6) inset,
         0 1px 0 rgba(255, 255, 255, 0.8) inset,
         0 -1px 0 rgba(0, 0, 0, 0.03) inset,
         0 8px 32px rgba(0, 0, 0, 0.08)`,
  };
};

// Acrylic effect - Fluent Design with noise texture feel
const getAcrylicStyles = (dark: boolean, intensity: 'subtle' | 'medium' | 'strong') => {
  const opacityMap = {
    subtle: { bg: dark ? 0.5 : 0.65, blur: 30 },
    medium: { bg: dark ? 0.6 : 0.75, blur: 40 },
    strong: { bg: dark ? 0.75 : 0.85, blur: 50 },
  };
  const { bg, blur } = opacityMap[intensity];

  return {
    background: dark 
      ? `linear-gradient(180deg, 
          rgba(40, 40, 45, ${bg}) 0%, 
          rgba(30, 30, 35, ${bg}) 100%)`
      : `linear-gradient(180deg, 
          rgba(255, 255, 255, ${bg}) 0%, 
          rgba(248, 248, 252, ${bg}) 100%)`,
    backdropFilter: `blur(${blur}px) saturate(150%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
    border: dark 
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: dark
      ? '0 4px 24px rgba(0, 0, 0, 0.4)'
      : '0 4px 24px rgba(0, 0, 0, 0.06)',
  };
};

// Frosted Glass effect - macOS Liquid Glass style
const getFrostedStyles = (dark: boolean, intensity: 'subtle' | 'medium' | 'strong') => {
  const opacityMap = {
    subtle: { bg: dark ? 0.4 : 0.55 },
    medium: { bg: dark ? 0.55 : 0.7 },
    strong: { bg: dark ? 0.7 : 0.85 },
  };
  const { bg } = opacityMap[intensity];

  return {
    background: dark 
      ? `linear-gradient(145deg, 
          rgba(35, 35, 40, ${bg}) 0%, 
          rgba(25, 25, 30, ${bg + 0.1}) 100%)`
      : `linear-gradient(145deg, 
          rgba(255, 255, 255, ${bg}) 0%, 
          rgba(250, 252, 255, ${bg + 0.1}) 100%)`,
    backdropFilter: 'blur(60px) saturate(200%) brightness(102%)',
    WebkitBackdropFilter: 'blur(60px) saturate(200%) brightness(102%)',
    border: dark 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: dark
      ? `0 0 0 0.5px rgba(255, 255, 255, 0.1) inset,
         0 2px 4px rgba(255, 255, 255, 0.02) inset,
         0 16px 48px rgba(0, 0, 0, 0.4)`
      : `0 0 0 0.5px rgba(255, 255, 255, 0.8) inset,
         0 2px 4px rgba(255, 255, 255, 0.5) inset,
         0 16px 48px rgba(0, 0, 0, 0.1)`,
  };
};

// Default glass - balanced effect
const getDefaultStyles = (dark: boolean, intensity: 'subtle' | 'medium' | 'strong') => {
  const opacityMap = {
    subtle: { bg: dark ? 0.7 : 0.8 },
    medium: { bg: dark ? 0.8 : 0.88 },
    strong: { bg: dark ? 0.88 : 0.94 },
  };
  const { bg } = opacityMap[intensity];

  return {
    background: dark 
      ? `rgba(20, 20, 25, ${bg})`
      : `rgba(255, 255, 255, ${bg})`,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: dark 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: dark
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
  };
};

const getVariantStyles = (
  variant: GlassVariant, 
  dark: boolean, 
  intensity: 'subtle' | 'medium' | 'strong'
) => {
  switch (variant) {
    case 'mica':
      return getMicaStyles(dark, intensity);
    case 'acrylic':
      return getAcrylicStyles(dark, intensity);
    case 'frosted':
      return getFrostedStyles(dark, intensity);
    default:
      return getDefaultStyles(dark, intensity);
  }
};

export function GlassCard({ 
  children, 
  dark = false, 
  variant = 'mica',
  intensity = 'medium',
  glow = false,
  animated = true,
  sx = {}, 
  ...props 
}: GlassCardProps) {
  const variantStyles = getVariantStyles(variant, dark, intensity);
  
  return (
    <Card
      elevation={0}
      sx={{
        ...variantStyles,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: animated 
          ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
          : 'none',
        
        // Luminous glow effect on hover
        '&::before': glow ? {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          padding: '1px',
          background: dark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.8), transparent, rgba(255,255,255,0.4))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        } : {},
        
        '&:hover': animated ? {
          transform: 'translateY(-2px)',
          boxShadow: dark
            ? '0 20px 60px rgba(0, 0, 0, 0.45)'
            : '0 20px 60px rgba(0, 0, 0, 0.12)',
          '&::before': glow ? {
            opacity: 1,
          } : {},
        } : {},
        
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

// Export convenience variants
export function MicaCard({ children, ...props }: Omit<GlassCardProps, 'variant'>) {
  return <GlassCard {...props} variant="mica">{children}</GlassCard>;
}

export function AcrylicCard({ children, ...props }: Omit<GlassCardProps, 'variant'>) {
  return <GlassCard {...props} variant="acrylic">{children}</GlassCard>;
}

export function FrostedCard({ children, ...props }: Omit<GlassCardProps, 'variant'>) {
  return <GlassCard {...props} variant="frosted">{children}</GlassCard>;
}

export default GlassCard;
