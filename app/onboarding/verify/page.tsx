'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CardContent,
  FormControlLabel,
  IconButton,
  Link as MuiLink,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Fade,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { GlassCard } from '../../components/GlassCard';
import { useI18n } from '../../lib/i18n';
import { useMounted } from '../../lib/useMounted';

const frequencyOptions = [
  { value: 7, labelEs: 'Semanal (7 días)', labelEn: 'Weekly (7 days)' },
  { value: 14, labelEs: 'Quincenal (14 días)', labelEn: 'Biweekly (14 days)' },
  { value: 30, labelEs: 'Mensual (30 días)', labelEn: 'Monthly (30 days)' },
  { value: -1, labelEs: 'Personalizado', labelEn: 'Custom' },
];

// Background images mapped to each stage
const stageBackgrounds = [
  '/assets/images/backgrounds/onBoardingNameandAmmount.png',
  '/assets/images/backgrounds/onBoardingFrecuencyandYield.png',
  '/assets/images/backgrounds/onBoardingWhatsappVerification.png',
  '/assets/images/backgrounds/onBoardingWhatsappVerification.png',
  '/assets/images/backgrounds/onBoardingSuccess.png',
];

type StatusMessage = { type: 'success' | 'error'; text: string } | null;
type Currency = 'BS' | 'USDC';

// Monochrome glass input styling
const glassInputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.95)',
    borderRadius: 2,
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,0,0,0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0,0,0,0.6)',
  },
  '& .MuiInputBase-input': {
    color: '#000',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(0,0,0,0.6)',
  },
};

// Helper component for summary items
function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: '#000', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function OnboardingVerifyPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const mounted = useMounted();
  
  // Stage control - 5 stages total following onboarding-flow.md
  const [currentStage, setCurrentStage] = useState(1);
  
  // Form data - Stage 1 (Name and Amount)
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState<Currency>('BS');
  const [totalAmount, setTotalAmount] = useState('');
  
  // Form data - Stage 2 (Frequency and Yield)
  const [frequencyDays, setFrequencyDays] = useState(30);
  const [customDays, setCustomDays] = useState('');
  const [yieldEnabled, setYieldEnabled] = useState(false);
  
  // Form data - Stage 3 (WhatsApp Verification)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Form data - Stage 4 (Confirmation)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // UI state
  const [message, setMessage] = useState<StatusMessage>(null);
  const [loading, setLoading] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const agentUrl = process.env.NEXT_PUBLIC_AGENT_BE_URL?.replace(/\/$/, '');
  const whatsappAgentNumber = process.env.NEXT_PUBLIC_WHATSAPP_AGENT_NUMBER || '';

  // Stage titles and descriptions for i18n
  const stageContent = useMemo(() => ({
    1: {
      title: locale === 'es' ? 'Información del Grupo' : 'Group Information',
      subtitle: locale === 'es' 
        ? 'Define el nombre y monto de tu tanda' 
        : 'Define the name and amount of your tanda',
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
    },
    2: {
      title: locale === 'es' ? 'Configuración' : 'Configuration',
      subtitle: locale === 'es' 
        ? 'Establece la frecuencia y opciones de rendimiento' 
        : 'Set frequency and yield options',
      icon: <CalendarMonthIcon sx={{ fontSize: 32 }} />,
    },
    3: {
      title: locale === 'es' ? 'Verificación WhatsApp' : 'WhatsApp Verification',
      subtitle: locale === 'es' 
        ? 'Verifica tu número para crear el grupo' 
        : 'Verify your number to create the group',
      icon: <WhatsAppIcon sx={{ fontSize: 32 }} />,
    },
    4: {
      title: locale === 'es' ? 'Confirmación' : 'Confirmation',
      subtitle: locale === 'es' 
        ? 'Revisa los datos y crea tu grupo' 
        : 'Review details and create your group',
      icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,
    },
    5: {
      title: locale === 'es' ? '¡Grupo Creado!' : 'Group Created!',
      subtitle: locale === 'es' 
        ? 'Tu tanda está lista para comenzar' 
        : 'Your tanda is ready to start',
      icon: <CelebrationIcon sx={{ fontSize: 32 }} />,
    },
  }), [locale]);

  const frequencyToSend = useMemo(() => {
    if (frequencyDays === -1) {
      const custom = Number(customDays || '0');
      return Number.isFinite(custom) && custom > 0 ? custom : 0;
    }
    return frequencyDays;
  }, [frequencyDays, customDays]);

  const getFrequencyLabel = useCallback(() => {
    if (frequencyDays === -1) return `${customDays} ${locale === 'es' ? 'días' : 'days'}`;
    const option = frequencyOptions.find(o => o.value === frequencyDays);
    return locale === 'es' ? option?.labelEs : option?.labelEn;
  }, [frequencyDays, customDays, locale]);

  // Validate stage before proceeding
  const canProceedFromStage = useCallback((stage: number): boolean => {
    switch (stage) {
      case 1:
        return groupName.trim() !== '' && Number(totalAmount) > 0;
      case 2:
        return frequencyToSend > 0;
      case 3:
        return verificationCode.trim() !== '';
      case 4:
        return isPhoneVerified;
      default:
        return true;
    }
  }, [groupName, totalAmount, frequencyToSend, verificationCode, isPhoneVerified]);

  // Request verification code - GET /api/onboarding/verify
  const requestVerificationCode = async () => {
    if (!agentUrl) {
      setMessage({ type: 'error', text: t.payment.missingAgent });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch(`${agentUrl}/api/onboarding/verify?phone=${encodeURIComponent(phoneNumber.trim())}`);
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data?.message || (locale === 'es' ? 'No se pudo enviar el código' : 'Could not send code'));
      
      if (data.code) {
        setVerificationCode(data.code);
      }
      
      setMessage({ 
        type: 'success', 
        text: locale === 'es' 
          ? 'Código generado. Envíalo al agente de WhatsApp.' 
          : 'Code generated. Send it to the WhatsApp agent.'
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (locale === 'es' ? 'Error desconocido' : 'Unknown error');
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Listen for webhook verification - POST /api/webhook/confirm_verification
  useEffect(() => {
    if (currentStage !== 4) return;
    
    const checkVerification = async () => {
      try {
        const res = await fetch(`/api/webhook/check_verification?phone=${encodeURIComponent(phoneNumber.trim())}`);
        const data = await res.json();
        
        if (data.verified) {
          setIsPhoneVerified(true);
          setMessage({ 
            type: 'success', 
            text: locale === 'es' 
              ? '¡Número de WhatsApp verificado correctamente!' 
              : 'WhatsApp number verified successfully!'
          });
        }
      } catch {
        // Silent fail - we'll keep polling
      }
    };

    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [currentStage, phoneNumber, locale]);

  // Create group - POST /api/onboarding
  const createGroup = async () => {
    if (!agentUrl) {
      setMessage({ type: 'error', text: t.payment.missingAgent });
      return;
    }

    setCreatingGroup(true);
    setMessage(null);

    const payload = {
      phoneNumber: phoneNumber.trim(),
      groupName: groupName.trim(),
      amountBs: currency === 'BS' ? Number(totalAmount) : undefined,
      amountUsdc: currency === 'USDC' ? Number(totalAmount) : undefined,
      frequencyDays: frequencyToSend,
      yieldEnabled,
      verificationCode: verificationCode.trim(),
    };

    try {
      const res = await fetch(`${agentUrl}/api/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data?.message || (locale === 'es' ? 'No se pudo crear el grupo' : 'Could not create group'));
      
      setCurrentStage(5);
      setMessage({ 
        type: 'success', 
        text: locale === 'es' ? '¡Grupo creado exitosamente!' : 'Group created successfully!'
      });
      
      // Redirect after 7 seconds
      setTimeout(() => {
        router.push('/');
      }, 7000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (locale === 'es' ? 'Error desconocido' : 'Unknown error');
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setCreatingGroup(false);
    }
  };

  // Generate WhatsApp link
  const whatsappLink = useMemo(() => {
    const whatsappMessage = encodeURIComponent(
      locale === 'es' 
        ? `Mi código de verificación es: ${verificationCode}` 
        : `My verification code is: ${verificationCode}`
    );
    return `https://wa.me/${whatsappAgentNumber}?text=${whatsappMessage}`;
  }, [verificationCode, whatsappAgentNumber, locale]);

  // Navigation handlers
  const goToNextStage = () => {
    if (canProceedFromStage(currentStage)) {
      setMessage(null);
      setCurrentStage(prev => Math.min(prev + 1, 5));
    }
  };

  const goToPrevStage = () => {
    setMessage(null);
    setCurrentStage(prev => Math.max(prev - 1, 1));
  };

  // Render stage content
  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              label={locale === 'es' ? 'Nombre del grupo' : 'Group name'}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
              placeholder={locale === 'es' ? 'Ej: Tanda de los Amigos' : 'Ex: Friends Tanda'}
              sx={glassInputStyle}
            />
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: 'rgba(0,0,0,0.6)' }}>
                {locale === 'es' ? 'Moneda del grupo' : 'Group currency'}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant={currency === 'BS' ? 'contained' : 'outlined'}
                  onClick={() => setCurrency('BS')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    bgcolor: currency === 'BS' ? '#000' : 'transparent',
                    color: currency === 'BS' ? '#fff' : '#000',
                    borderColor: 'rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: currency === 'BS' ? '#222' : 'rgba(0,0,0,0.05)',
                      borderColor: '#000',
                    },
                  }}
                >
                  Bolivianos (Bs)
                </Button>
                <Button
                  variant={currency === 'USDC' ? 'contained' : 'outlined'}
                  onClick={() => setCurrency('USDC')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    bgcolor: currency === 'USDC' ? '#000' : 'transparent',
                    color: currency === 'USDC' ? '#fff' : '#000',
                    borderColor: 'rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: currency === 'USDC' ? '#222' : 'rgba(0,0,0,0.05)',
                      borderColor: '#000',
                    },
                  }}
                >
                  USDC (Crypto)
                </Button>
              </Stack>
            </Box>
            
            <TextField
              label={`${locale === 'es' ? 'Monto total' : 'Total amount'} (${currency})`}
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              fullWidth
              placeholder={currency === 'BS' ? 'Ej: 10000' : 'Ej: 100'}
              sx={glassInputStyle}
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              select
              label={locale === 'es' ? 'Frecuencia de pagos' : 'Payment frequency'}
              value={frequencyDays}
              onChange={(e) => setFrequencyDays(Number(e.target.value))}
              fullWidth
              sx={glassInputStyle}
            >
              {frequencyOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {locale === 'es' ? opt.labelEs : opt.labelEn}
                </MenuItem>
              ))}
            </TextField>
            
            {frequencyDays === -1 && (
              <TextField
                label={locale === 'es' ? 'Días personalizados' : 'Custom days'}
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                fullWidth
                placeholder="Ej: 21"
                sx={glassInputStyle}
              />
            )}
            
            <Box sx={{ 
              p: 2.5, 
              borderRadius: 2, 
              bgcolor: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={yieldEnabled} 
                    onChange={(_, checked) => setYieldEnabled(checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#000',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#000',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    {locale === 'es' ? 'Generar rendimientos (DeFi)' : 'Generate yield (DeFi)'}
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', display: 'block', mt: 1 }}>
                {locale === 'es' 
                  ? 'El dinero acumulado puede generar intereses mientras espera ser entregado. ' 
                  : 'Accumulated funds can earn interest while waiting to be delivered. '}
                <MuiLink component={Link} href="/ToS" sx={{ color: '#000', fontWeight: 600 }}>
                  {locale === 'es' ? 'Ver términos de servicio' : 'See terms of service'}
                </MuiLink>
              </Typography>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <TextField
              label={locale === 'es' ? 'Número de WhatsApp (con código de país)' : 'WhatsApp number (with country code)'}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              placeholder="Ej: +591 70000000"
              sx={glassInputStyle}
            />
            
            <Button
              variant="outlined"
              onClick={requestVerificationCode}
              disabled={loading || !phoneNumber.trim()}
              sx={{
                borderColor: '#000',
                color: '#000',
                py: 1.5,
                '&:hover': {
                  borderColor: '#000',
                  bgcolor: 'rgba(0,0,0,0.05)',
                },
                '&:disabled': {
                  borderColor: 'rgba(0,0,0,0.2)',
                  color: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : (locale === 'es' ? 'Generar código de verificación' : 'Generate verification code')}
            </Button>
            
            {verificationCode && (
              <Fade in>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}>
                    {locale === 'es' ? 'Tu código de verificación es:' : 'Your verification code is:'}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '0.3em',
                      color: '#000',
                      mb: 3,
                    }}
                  >
                    {verificationCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}>
                    {locale === 'es' 
                      ? 'Envía este código al agente de WhatsApp para verificar tu número' 
                      : 'Send this code to the WhatsApp agent to verify your number'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    href={whatsappLink}
                    target="_blank"
                    sx={{
                      bgcolor: '#000',
                      color: '#fff',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#222',
                      },
                    }}
                  >
                    {locale === 'es' ? 'Enviar código por WhatsApp' : 'Send code via WhatsApp'}
                  </Button>
                </Box>
              </Fade>
            )}
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={3}>
            {!isPhoneVerified ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#000', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                  {locale === 'es' ? 'Esperando verificación de WhatsApp...' : 'Waiting for WhatsApp verification...'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', display: 'block', mt: 1 }}>
                  {locale === 'es' ? 'Asegúrate de haber enviado el código al agente' : 'Make sure you sent the code to the agent'}
                </Typography>
              </Box>
            ) : (
              <Fade in>
                <Stack spacing={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#000',
                    mb: 2,
                  }}>
                    <CheckCircleIcon />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {locale === 'es' ? 'Número de WhatsApp verificado correctamente' : 'WhatsApp number verified successfully'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
                    {locale === 'es' ? 'Resumen de tu grupo:' : 'Group summary:'}
                  </Typography>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    borderRadius: 2, 
                    p: 2.5,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}>
                    <Stack spacing={1}>
                      <SummaryItem label={locale === 'es' ? 'Nombre del grupo' : 'Group name'} value={groupName} />
                      <SummaryItem label={locale === 'es' ? 'Moneda' : 'Currency'} value={currency} />
                      <SummaryItem label={locale === 'es' ? 'Monto total' : 'Total amount'} value={`${totalAmount} ${currency}`} />
                      <SummaryItem label={locale === 'es' ? 'Frecuencia' : 'Frequency'} value={getFrequencyLabel() || ''} />
                      <SummaryItem 
                        label={locale === 'es' ? 'Rendimientos' : 'Yield'} 
                        value={yieldEnabled 
                          ? (locale === 'es' ? 'Activados' : 'Enabled') 
                          : (locale === 'es' ? 'Desactivados' : 'Disabled')
                        } 
                      />
                      <SummaryItem label="WhatsApp" value={phoneNumber} />
                    </Stack>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', textAlign: 'center', mt: 2 }}>
                    {locale === 'es' ? '¿Deseas crear el grupo con estos datos?' : 'Do you want to create the group with this data?'}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={createGroup}
                    disabled={creatingGroup}
                    sx={{
                      bgcolor: '#000',
                      color: '#fff',
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: '#222',
                      },
                    }}
                  >
                    {creatingGroup ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (locale === 'es' ? 'Crear grupo ahora' : 'Create group now')}
                  </Button>
                </Stack>
              </Fade>
            )}
          </Stack>
        );

      case 5:
        return (
          <Stack spacing={3} sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#000', mx: 'auto' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
              {locale === 'es' ? '¡Felicitaciones!' : 'Congratulations!'}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.8)' }}>
              {locale === 'es' ? 'Has creado un grupo exitosamente' : 'You have successfully created a group'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)' }}>
              {locale === 'es' 
                ? 'Revisa tu WhatsApp para encontrar el link de invitación' 
                : 'Check your WhatsApp for the invitation link'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mt: 2 }}>
              {locale === 'es' 
                ? 'Nota: El grupo está en estado DRAFT. Escribe "iniciar tanda" en el grupo de WhatsApp para activar el contrato y comenzar.' 
                : 'Note: The group is in DRAFT state. Type "iniciar tanda" in the WhatsApp group to activate the contract and start.'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)' }}>
              {locale === 'es' ? 'Serás redirigido a la página principal en unos segundos...' : 'You will be redirected to the main page in a few seconds...'}
            </Typography>
            <CircularProgress sx={{ color: '#000', mx: 'auto', mt: 2 }} size={24} />
          </Stack>
        );

      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#000' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
    >
      {/* Background image carousel based on stage */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${stageBackgrounds[currentStage - 1]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.6s ease-in-out',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(2px)',
          },
        }}
      />

      {/* Grid overlay */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Header />
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: 4,
        }}
      >
        {/* Stage indicator header */}
        <Fade in key={`header-${currentStage}`}>
          <Box
            sx={{
              maxWidth: 500,
              mb: 4,
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ color: '#fff' }}>
                {stageContent[currentStage as keyof typeof stageContent].icon}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {locale === 'es' ? `Paso ${currentStage} de 5` : `Step ${currentStage} of 5`}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                  {stageContent[currentStage as keyof typeof stageContent].title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {stageContent[currentStage as keyof typeof stageContent].subtitle}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Fade>

        {/* Main content area */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {/* Form panel - Mica Glass */}
          <GlassCard
            variant="mica"
            intensity="medium"
            glow
            sx={{
              width: { xs: '100%', sm: 450 },
              maxWidth: '100%',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {message && (
                <Alert 
                  severity={message.type} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    bgcolor: message.type === 'error' ? 'rgba(255, 0, 0, 0.08)' : 'rgba(0, 255, 0, 0.08)',
                    border: message.type === 'error' ? '1px solid rgba(255, 0, 0, 0.2)' : '1px solid rgba(0, 255, 0, 0.2)',
                  }}
                >
                  {message.text}
                </Alert>
              )}

              <Fade in key={`content-${currentStage}`}>
                <Box>{renderStageContent()}</Box>
              </Fade>

              {/* Navigation */}
              {currentStage < 5 && (
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                  <IconButton
                    onClick={goToPrevStage}
                    disabled={currentStage === 1}
                    sx={{
                      color: currentStage === 1 ? 'rgba(0,0,0,0.2)' : '#000',
                      bgcolor: 'rgba(0,0,0,0.05)',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>

                  {/* Stage indicator */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    {[1, 2, 3, 4].map((stage) => (
                      <Box
                        key={stage}
                        sx={{
                          width: stage === currentStage ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: stage <= currentStage ? '#000' : 'rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Stack>

                  {currentStage < 4 ? (
                    <IconButton
                      onClick={goToNextStage}
                      disabled={!canProceedFromStage(currentStage)}
                      sx={{
                        color: !canProceedFromStage(currentStage) ? 'rgba(0,0,0,0.2)' : '#000',
                        bgcolor: 'rgba(0,0,0,0.05)',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  ) : (
                    <Box sx={{ width: 40 }} />
                  )}
                </Stack>
              )}
            </CardContent>
          </GlassCard>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Footer />
      </Box>
    </Box>
  );
}
