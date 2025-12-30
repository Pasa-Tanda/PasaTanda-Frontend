'use client';

import { use, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Fade,
  CircularProgress,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { PaymentRequirements } from 'x402-stellar-client';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticleBackground from '../../components/ParticleBackground';
import QRPlaceholder from '../../components/QRPlaceholder';
import { useI18n } from '../../lib/i18n';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type PaymentMethod = 'qrsimple' | 'stellar';

type Order = {
  id: string;
  status: string;
  amountFiat: number;
  currencyFiat?: string;
  amountUsdc?: number;
  qrPayloadUrl?: string;
  xdrChallenge?: string;
  paymentRequirements?: PaymentRequirements;
  groupId?: number;
  groupName?: string;
  roundNumber?: number;
  dueDate?: string;
};

// Glass card component with monochrome theme
function GlassCard({ children, sx = {}, dark = false, ...props }: { children: React.ReactNode; sx?: object; dark?: boolean; [key: string]: unknown }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: dark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: dark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: dark 
            ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'VERIFIED':
        return { color: '#000', bgcolor: 'rgba(0,255,0,0.15)', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
      case 'FAILED':
      case 'REJECTED':
        return { color: '#000', bgcolor: 'rgba(255,0,0,0.15)', icon: <ErrorIcon sx={{ fontSize: 16 }} /> };
      case 'PENDING':
      case 'CLAIMED_BY_USER':
      default:
        return { color: '#000', bgcolor: 'rgba(0,0,0,0.08)', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={config.icon}
      label={status || 'PENDING'}
      sx={{
        fontWeight: 700,
        color: config.color,
        bgcolor: config.bgcolor,
        border: '1px solid rgba(0,0,0,0.1)',
        '& .MuiChip-icon': {
          color: config.color,
        },
      }}
    />
  );
}

interface PageParams {
  id: string;
}

export default function PaymentPage({ params }: { params: Promise<PageParams> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qrsimple');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [proof, setProof] = useState({ bank: '', reference: '', screenshotUrl: '', amount: '' });

  const agentUrl = useMemo(() => process.env.NEXT_PUBLIC_AGENT_BE_URL?.replace(/\/$/, ''), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOrder = async () => {
    setError(null);
    setPageLoading(true);
    
    if (!agentUrl) {
      setError(t.payment.missingAgent);
      setPageLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${agentUrl}/api/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'No se pudo cargar la orden');
      setOrder(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  };

  const handleFiatClaim = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!agentUrl) {
      setError(t.payment.missingAgent);
      setLoading(false);
      return;
    }
    try {
      const payload = {
        paymentType: 'fiat',
        proofMetadata: {
          bank: proof.bank,
          amount: Number(proof.amount || order?.amountFiat || 0),
          reference: proof.reference,
          screenshotUrl: proof.screenshotUrl,
        },
      };
      const res = await fetch(`${agentUrl}/api/orders/${orderId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'No se pudo enviar la confirmación');
      setSuccess(t.payment.claimSent);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoClaim = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!agentUrl) {
      setError(t.payment.missingAgent);
      setLoading(false);
      return;
    }
    try {
      const { buildXPaymentFromChallenge, createXPaymentFromRequirements } = await import('../../lib/stellar');
      let xPaymentToken = '';

      if (order?.paymentRequirements) {
        const result = await createXPaymentFromRequirements(order.paymentRequirements);
        xPaymentToken = result.xPayment;
      } else if (order?.xdrChallenge) {
        const result = await buildXPaymentFromChallenge(order.xdrChallenge);
        xPaymentToken = result.xPayment;
      } else {
        throw new Error('No hay challenge disponible para firmar');
      }

      const res = await fetch(`${agentUrl}/api/orders/${orderId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'crypto', xPayment: xPaymentToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'No se pudo reclamar el pago');
      setSuccess(t.payment.walletReady);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const amountUsdc = order?.amountUsdc ? order.amountUsdc.toFixed(2) : '0';
  const amountUsdcLabel = order?.amountUsdc ? `${amountUsdc} USDC` : 'USDC dinámico';

  // Loading state
  if (pageLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ParticleBackground variant="stars" />
        <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <CircularProgress sx={{ color: '#000' }} />
          <Typography variant="h6" sx={{ color: '#000' }}>Cargando orden...</Typography>
        </Stack>
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
      {/* Particle Background */}
      <ParticleBackground variant="stars" />

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

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
          <Fade in={mounted} timeout={600}>
            <Stack spacing={3}>
              {/* Order Header Card */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', md: 'center' }} 
                    spacing={2}
                  >
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#000',
                          fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                      >
                        {order ? `Bs. ${order.amountFiat?.toFixed(2) || '0'}` : 'Cargando...'}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                          Orden:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            bgcolor: 'rgba(0,0,0,0.05)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#000',
                          }}
                        >
                          {orderId}
                        </Typography>
                      </Stack>
                      {order?.groupName && (
                        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mt: 0.5 }}>
                          Grupo: {order.groupName} {order.roundNumber && `• Ronda ${order.roundNumber}`}
                        </Typography>
                      )}
                    </Box>
                    <StatusBadge status={order?.status || 'PENDING'} />
                  </Stack>
                </CardContent>
              </GlassCard>

              {/* Alerts */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(255,0,0,0.2)',
                  }}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert 
                  severity="success"
                  sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(0,255,0,0.2)',
                  }}
                >
                  {success}
                </Alert>
              )}

              {/* Payment Content */}
              <GlassCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Grid container spacing={4}>
                    {/* Left Column - Summary */}
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                          Resumen del Pago
                        </Typography>
                        
                        <Box sx={{ 
                          p: 3, 
                          borderRadius: 3, 
                          bgcolor: 'rgba(0,0,0,0.03)',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
                                MONTO FIAT
                              </Typography>
                              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                                Bs. {order?.amountFiat?.toFixed(2) || '0'}
                              </Typography>
                            </Box>
                            <Divider />
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
                                EQUIVALENTE USDC
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                                {amountUsdcLabel}
                              </Typography>
                            </Box>
                            {order?.groupId && (
                              <>
                                <Divider />
                                <Box>
                                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
                                    ID GRUPO
                                  </Typography>
                                  <Typography variant="body1" sx={{ color: '#000' }}>
                                    {order.groupId}
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Stack>
                        </Box>

                        <Divider />

                        {/* Payment Method Selector */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#000' }}>
                            Método de pago
                          </Typography>
                          <FormControl fullWidth>
                            <Select 
                              value={paymentMethod} 
                              onChange={handlePaymentMethodChange}
                              sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(0,0,0,0.2)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#000',
                                },
                              }}
                            >
                              <MenuItem value="qrsimple">
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar sx={{ bgcolor: '#000', width: 32, height: 32 }}>
                                    <QrCodeIcon sx={{ fontSize: 18 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>QR Simple</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Bolivianos (Bs)</Typography>
                                  </Box>
                                </Stack>
                              </MenuItem>
                              <MenuItem value="stellar">
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar sx={{ bgcolor: '#000', width: 32, height: 32 }}>
                                    <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Stellar Wallet</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>USDC</Typography>
                                  </Box>
                                </Stack>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Right Column - Payment Action */}
                    <Grid size={{ xs: 12, md: 7 }}>
                      {paymentMethod === 'qrsimple' ? (
                        <Stack spacing={3}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                            Pago con QR Bancario
                          </Typography>
                          
                          {/* QR Display */}
                          <Box 
                            sx={{ 
                              border: '1px solid rgba(0,0,0,0.1)', 
                              borderRadius: 3, 
                              p: 3, 
                              textAlign: 'center', 
                              bgcolor: '#fff',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                              },
                            }}
                          >
                            {order?.qrPayloadUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={order.qrPayloadUrl} 
                                alt="QR de pago" 
                                style={{ 
                                  width: '100%', 
                                  maxWidth: 280,
                                  borderRadius: 8,
                                }} 
                              />
                            ) : (
                              <QRPlaceholder size={240} text="QR" />
                            )}
                            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'rgba(0,0,0,0.5)' }}>
                              Escanea con tu app bancaria
                            </Typography>
                          </Box>

                          {/* Proof Form */}
                          <Stack spacing={2}>
                            <TextField 
                              label="Banco" 
                              value={proof.bank} 
                              onChange={(e) => setProof((p) => ({ ...p, bank: e.target.value }))} 
                              fullWidth
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <TextField 
                              label="Referencia de transferencia" 
                              value={proof.reference} 
                              onChange={(e) => setProof((p) => ({ ...p, reference: e.target.value }))} 
                              fullWidth
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <TextField 
                              label="URL de captura (opcional)" 
                              value={proof.screenshotUrl} 
                              onChange={(e) => setProof((p) => ({ ...p, screenshotUrl: e.target.value }))} 
                              fullWidth
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <TextField 
                              label="Monto pagado (Bs)" 
                              value={proof.amount} 
                              onChange={(e) => setProof((p) => ({ ...p, amount: e.target.value }))} 
                              fullWidth
                              size="small"
                              type="number"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <Button 
                              variant="contained" 
                              onClick={handleFiatClaim} 
                              disabled={loading}
                              fullWidth
                              sx={{
                                py: 1.5,
                                bgcolor: '#000',
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
                              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t.payment.confirmFiat}
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={3}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                            Pago con Stellar Wallet
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              p: 4, 
                              borderRadius: 3, 
                              bgcolor: 'rgba(0,0,0,0.03)',
                              border: '1px solid rgba(0,0,0,0.08)',
                              textAlign: 'center',
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: '#000', 
                                width: 80, 
                                height: 80, 
                                mx: 'auto',
                                mb: 3,
                              }}
                            >
                              <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', mb: 3 }}>
                              Firma el XDR challenge con Freighter. Usamos x402-stellar-client para generar el X-PAYMENT de forma segura.
                            </Typography>
                            <Button 
                              variant="contained" 
                              onClick={handleCryptoClaim} 
                              disabled={loading}
                              fullWidth
                              size="large"
                              sx={{
                                py: 1.5,
                                bgcolor: '#000',
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
                              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t.payment.payWithWallet}
                            </Button>
                          </Box>

                          <Divider />
                          
                          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
                            Si tu wallet está en otra red, Freighter mostrará una alerta antes de firmar.
                          </Typography>
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
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
