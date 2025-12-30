'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useI18n } from '../../lib/i18n';

const frequencyOptions = [
  { value: 7, label: 'Semanal (7 días)' },
  { value: 14, label: 'Quincenal (14 días)' },
  { value: 30, label: 'Mensual (30 días)' },
  { value: -1, label: 'Personalizado' },
];

const backgroundImages = [
  '/assets/images/placeholders/image.png',
  '/assets/images/placeholders/image.png',
  '/assets/images/placeholders/image.png',
  '/assets/images/placeholders/image.png',
  '/assets/images/placeholders/image.png',
];

const stageMessages = [
  'Crea tu grupo de ahorro en WhatsApp ahora',
  'Configura la frecuencia de tu tanda',
  'Verifica tu número de WhatsApp',
  'Confirma los datos de tu grupo',
  '¡Felicitaciones! Tu grupo ha sido creado',
];

type StatusMessage = { type: 'success' | 'error'; text: string } | null;
type Currency = 'BS' | 'USDC';

// Shared input styling for glass effect
const glassInputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255,255,255,0.8)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255,255,255,0.7)',
  },
};

// Helper component for summary items
function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function OnboardingVerifyPage() {
  const { t } = useI18n();
  const router = useRouter();
  
  // Stage control
  const [currentStage, setCurrentStage] = useState(1);
  
  // Form data - Stage 1
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState<Currency>('BS');
  const [totalAmount, setTotalAmount] = useState('');
  
  // Form data - Stage 2
  const [frequencyDays, setFrequencyDays] = useState(30);
  const [customDays, setCustomDays] = useState('');
  const [yieldEnabled, setYieldEnabled] = useState(false);
  
  // Form data - Stage 3 & 4
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // UI state
  const [message, setMessage] = useState<StatusMessage>(null);
  const [loading, setLoading] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const agentUrl = process.env.NEXT_PUBLIC_AGENT_BE_URL?.replace(/\/$/, '');
  const whatsappAgentNumber = process.env.NEXT_PUBLIC_WHATSAPP_AGENT_NUMBER || '';

  const frequencyToSend = useMemo(() => {
    if (frequencyDays === -1) {
      const custom = Number(customDays || '0');
      return Number.isFinite(custom) && custom > 0 ? custom : 0;
    }
    return frequencyDays;
  }, [frequencyDays, customDays]);

  const getFrequencyLabel = useCallback(() => {
    if (frequencyDays === -1) return `${customDays} días`;
    const option = frequencyOptions.find(o => o.value === frequencyDays);
    return option?.label || `${frequencyDays} días`;
  }, [frequencyDays, customDays]);

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

  // Request verification code
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
      
      if (!res.ok) throw new Error(data?.message || 'No se pudo enviar el código');
      
      if (data.code) {
        setVerificationCode(data.code);
      }
      
      setMessage({ type: 'success', text: 'Código generado. Envíalo al agente de WhatsApp.' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Listen for webhook verification
  useEffect(() => {
    if (currentStage !== 4) return;
    
    const checkVerification = async () => {
      try {
        const res = await fetch(`/api/webhook/check_verification?phone=${encodeURIComponent(phoneNumber.trim())}`);
        const data = await res.json();
        
        if (data.verified) {
          setIsPhoneVerified(true);
          setMessage({ type: 'success', text: '¡Número de WhatsApp verificado correctamente!' });
        }
      } catch {
        // Silent fail - we'll keep polling
      }
    };

    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [currentStage, phoneNumber]);

  // Create group
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
      
      if (!res.ok) throw new Error(data?.message || 'No se pudo crear el grupo');
      
      setCurrentStage(5);
      setMessage({ type: 'success', text: '¡Grupo creado exitosamente!' });
      
      // Redirect after 7 seconds
      setTimeout(() => {
        router.push('/');
      }, 7000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setCreatingGroup(false);
    }
  };

  // Generate WhatsApp link
  const whatsappLink = useMemo(() => {
    const whatsappMessage = encodeURIComponent(`Mi código de verificación es: ${verificationCode}`);
    return `https://wa.me/${whatsappAgentNumber}?text=${whatsappMessage}`;
  }, [verificationCode, whatsappAgentNumber]);

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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Información básica del grupo
            </Typography>
            
            <TextField
              label="Nombre del grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
              placeholder="Ej: Tanda de los Amigos"
              sx={glassInputStyle}
            />
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
                Moneda del grupo
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant={currency === 'BS' ? 'contained' : 'outlined'}
                  onClick={() => setCurrency('BS')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    bgcolor: currency === 'BS' ? 'rgba(255,255,255,0.9)' : 'transparent',
                    color: currency === 'BS' ? '#000' : 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      bgcolor: currency === 'BS' ? '#fff' : 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)',
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
                    bgcolor: currency === 'USDC' ? 'rgba(255,255,255,0.9)' : 'transparent',
                    color: currency === 'USDC' ? '#000' : 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      bgcolor: currency === 'USDC' ? '#fff' : 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                  }}
                >
                  USDC (Crypto)
                </Button>
              </Stack>
            </Box>
            
            <TextField
              label={`Monto total (${currency})`}
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Configuración de la tanda
            </Typography>
            
            <TextField
              select
              label="Frecuencia de pagos"
              value={frequencyDays}
              onChange={(e) => setFrequencyDays(Number(e.target.value))}
              fullWidth
              sx={glassInputStyle}
            >
              {frequencyOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            
            {frequencyDays === -1 && (
              <TextField
                label="Días personalizados"
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                fullWidth
                placeholder="Ej: 21"
                sx={glassInputStyle}
              />
            )}
            
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={yieldEnabled} 
                    onChange={(_, checked) => setYieldEnabled(checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4CAF50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Generar rendimientos (DeFi)
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 1 }}>
                El dinero acumulado puede generar intereses mientras espera ser entregado.{' '}
                <MuiLink component={Link} href="/ToS" sx={{ color: '#90CAF9' }}>
                  Ver términos de servicio
                </MuiLink>
              </Typography>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Verifica tu número de WhatsApp
            </Typography>
            
            <TextField
              label="Número de WhatsApp (con código de país)"
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
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Generar código de verificación'}
            </Button>
            
            {verificationCode && (
              <Fade in>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Tu código de verificación es:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '0.3em',
                      color: '#fff',
                      textShadow: '0 0 20px rgba(255,255,255,0.3)',
                      mb: 3,
                    }}
                  >
                    {verificationCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Envía este código al agente de WhatsApp para verificar tu número
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    href={whatsappLink}
                    target="_blank"
                    sx={{
                      bgcolor: '#25D366',
                      color: '#fff',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#128C7E',
                      },
                    }}
                  >
                    Enviar código por WhatsApp
                  </Button>
                </Box>
              </Fade>
            )}
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Confirma tu grupo
            </Typography>
            
            {!isPhoneVerified ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Esperando verificación de WhatsApp...
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
                  Asegúrate de haber enviado el código al agente
                </Typography>
              </Box>
            ) : (
              <Fade in>
                <Stack spacing={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: '#4CAF50',
                    mb: 2,
                  }}>
                    <CheckCircleIcon />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Número de WhatsApp verificado correctamente
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Resumen de tu grupo:
                  </Typography>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(0,0,0,0.2)', 
                    borderRadius: 2, 
                    p: 2,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    <Stack spacing={1.5}>
                      <SummaryItem label="Nombre del grupo" value={groupName} />
                      <SummaryItem label="Moneda" value={currency} />
                      <SummaryItem label="Monto total" value={`${totalAmount} ${currency}`} />
                      <SummaryItem label="Frecuencia" value={getFrequencyLabel()} />
                      <SummaryItem label="Rendimientos" value={yieldEnabled ? 'Activados' : 'Desactivados'} />
                      <SummaryItem label="WhatsApp" value={phoneNumber} />
                    </Stack>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', mt: 2 }}>
                    ¿Deseas crear el grupo con estos datos?
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={createGroup}
                    disabled={creatingGroup}
                    sx={{
                      bgcolor: '#fff',
                      color: '#000',
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    {creatingGroup ? <CircularProgress size={24} /> : 'Crear grupo ahora'}
                  </Button>
                </Stack>
              </Fade>
            )}
          </Stack>
        );

      case 5:
        return (
          <Stack spacing={3} sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mx: 'auto' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
              ¡Felicitaciones!
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Has creado un grupo exitosamente
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Revisa tu WhatsApp para encontrar el link de invitación
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Serás redirigido a la página principal en unos segundos...
            </Typography>
            <CircularProgress sx={{ color: 'rgba(255,255,255,0.5)', mx: 'auto', mt: 2 }} size={24} />
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${backgroundImages[currentStage - 1]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.4)',
          },
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
        {/* Stage message - Green box */}
        <Fade in key={currentStage}>
          <Box
            sx={{
              maxWidth: 500,
              mb: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(76, 175, 80, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {stageMessages[currentStage - 1]}
            </Typography>
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
          {/* Form panel - Yellow/Glass box */}
          <Card
            elevation={0}
            sx={{
              width: { xs: '100%', sm: 450 },
              maxWidth: '100%',
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              // Glassmorphism / Mica effect
              bgcolor: 'rgba(255, 193, 7, 0.15)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {message && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 3, bgcolor: message.type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.9)' }}
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
                    color: currentStage === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
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
                        bgcolor: stage <= currentStage ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
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
                      color: !canProceedFromStage(currentStage) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                ) : (
                  <Box sx={{ width: 40 }} /> // Placeholder for alignment
                )}
              </Stack>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
