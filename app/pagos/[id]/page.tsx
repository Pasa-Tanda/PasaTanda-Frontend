'use client';

import { use, useEffect, useMemo, useState, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
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
import LinkIcon from '@mui/icons-material/Link';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  connectWallet,
  getConnectedAddress,
  buildXPayment,
  checkUsdcTrustline,
  addUsdcTrustline,
  disconnectWallet,
  TrustlineStatus,
  WalletInfo,
  PAYMENT_TOKEN,
} from '../../lib/stellar-wallet';
import { GlassCard } from '../../components/GlassCard';

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
  
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qrsimple');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [proof, setProof] = useState({ bank: '', reference: '', screenshotUrl: '', amount: '' });
  
  // Wallet state
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [trustlineStatus, setTrustlineStatus] = useState<TrustlineStatus | null>(null);
  const [trustlineDialogOpen, setTrustlineDialogOpen] = useState(false);
  const [trustlineLoading, setTrustlineLoading] = useState(false);

  const agentUrl = useMemo(() => process.env.NEXT_PUBLIC_AGENT_BE_URL?.replace(/\/$/, ''), []);

  useEffect(() => {
    setMounted(true);
    
    // Check if wallet was previously connected
    const checkExistingConnection = async () => {
      try {
        const address = await getConnectedAddress();
        if (address) {
          setWalletInfo({
            address,
            network: 'TESTNET',
            networkPassphrase: 'Test SDF Network ; September 2015',
            isConnected: true,
          });
          // Check trustline status
          const status = await checkUsdcTrustline(address);
          setTrustlineStatus(status);
        }
      } catch {
        console.log('No existing wallet connection');
      }
    };
    checkExistingConnection();
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

  // Connect wallet using stellar-wallets-kit
  const handleConnectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await connectWallet();
      setWalletInfo(wallet);
      
      // Check trustline status
      const status = await checkUsdcTrustline(wallet.address);
      setTrustlineStatus(status);
      
      // If no trustline, prompt user
      if (!status.exists) {
        setTrustlineDialogOpen(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : locale === 'es' ? 'Error al conectar wallet' : 'Error connecting wallet';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Handle disconnect wallet
  const handleDisconnectWallet = useCallback(() => {
    disconnectWallet();
    setWalletInfo(null);
    setTrustlineStatus(null);
  }, []);

  // Add USDC trustline
  const handleAddTrustline = useCallback(async () => {
    if (!walletInfo?.address) return;
    
    setTrustlineLoading(true);
    setError(null);
    try {
      const result = await addUsdcTrustline(walletInfo.address);
      
      if (result.success) {
        setTrustlineStatus({ 
          exists: true, 
          balance: '0', 
          limit: '922337203685.4775807',
          assetCode: result.assetCode,
          assetIssuer: result.assetIssuer,
        });
        setTrustlineDialogOpen(false);
        setSuccess(`${t.payment.trustlineAdded}. TX: ${result.txHash?.substring(0, 8)}...`);
      } else {
        throw new Error(result.error);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t.payment.errorProcessing;
      setError(errorMessage);
    } finally {
      setTrustlineLoading(false);
    }
  }, [walletInfo?.address, t.payment.trustlineAdded, t.payment.errorProcessing]);

  const handleCryptoClaim = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    if (!agentUrl) {
      setError(t.payment.missingAgent);
      setLoading(false);
      return;
    }
    
    // Ensure wallet is connected
    if (!walletInfo?.address) {
      setError(locale === 'es' ? 'Primero conecta tu wallet' : 'Please connect your wallet first');
      setLoading(false);
      return;
    }
    
    // Ensure trustline exists
    if (!trustlineStatus?.exists) {
      setTrustlineDialogOpen(true);
      setLoading(false);
      return;
    }
    
    try {
      let xPaymentToken = '';

      if (order?.paymentRequirements) {
        // Use the old method for PaymentRequirements
        const { createXPaymentFromRequirements } = await import('../../lib/stellar');
        const result = await createXPaymentFromRequirements(order.paymentRequirements);
        xPaymentToken = result.xPayment;
      } else if (order?.xdrChallenge) {
        // Use stellar-wallets-kit via our wrapper
        xPaymentToken = await buildXPayment(order.xdrChallenge, {
          address: walletInfo.address,
          networkPassphrase: walletInfo.networkPassphrase,
        });
      } else {
        throw new Error(locale === 'es' ? 'No hay challenge disponible para firmar' : 'No challenge available to sign');
      }

      const res = await fetch(`${agentUrl}/api/orders/${orderId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'crypto', xPayment: xPaymentToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || (locale === 'es' ? 'No se pudo reclamar el pago' : 'Could not claim payment'));
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
              <GlassCard variant="mica" intensity="medium" glow>
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
              <GlassCard variant="mica" intensity="subtle">
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
                            {locale === 'es' ? 'Pago con Stellar Wallet' : 'Pay with Stellar Wallet'}
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
                            {!walletInfo ? (
                              <>
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
                                  {locale === 'es' 
                                    ? 'Conecta tu wallet Stellar para firmar el pago de forma segura.'
                                    : 'Connect your Stellar wallet to sign the payment securely.'}
                                </Typography>
                                <Button 
                                  variant="contained" 
                                  onClick={handleConnectWallet} 
                                  disabled={loading}
                                  fullWidth
                                  size="large"
                                  startIcon={<LinkIcon />}
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
                                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (locale === 'es' ? 'Conectar Wallet' : 'Connect Wallet')}
                                </Button>
                              </>
                            ) : (
                              <>
                                {/* Wallet Connected State */}
                                <Stack spacing={2} alignItems="center">
                                  <Chip 
                                    icon={<CheckCircleIcon />}
                                    label={locale === 'es' ? 'Wallet Conectada' : 'Wallet Connected'}
                                    sx={{ 
                                      bgcolor: 'rgba(0,200,0,0.1)', 
                                      color: '#000',
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontFamily: 'monospace',
                                      bgcolor: 'rgba(0,0,0,0.05)',
                                      px: 2,
                                      py: 1,
                                      borderRadius: 2,
                                      color: '#000',
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 6)}
                                  </Typography>
                                  
                                  {/* Trustline Status */}
                                  {trustlineStatus && (
                                    <Chip 
                                      icon={trustlineStatus.exists ? <CheckCircleIcon /> : <WarningAmberIcon />}
                                      label={trustlineStatus.exists 
                                        ? (locale === 'es' ? 'Trustline USDC ✓' : 'USDC Trustline ✓')
                                        : (locale === 'es' ? 'Sin Trustline USDC' : 'No USDC Trustline')
                                      }
                                      size="small"
                                      sx={{ 
                                        bgcolor: trustlineStatus.exists ? 'rgba(0,200,0,0.1)' : 'rgba(255,150,0,0.1)', 
                                        color: '#000',
                                      }}
                                    />
                                  )}
                                  
                                  {trustlineStatus?.exists && trustlineStatus.balance && (
                                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                                      Balance: {parseFloat(trustlineStatus.balance).toFixed(2)} USDC
                                    </Typography>
                                  )}
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                <Stack spacing={2}>
                                  {!trustlineStatus?.exists && (
                                    <Button 
                                      variant="outlined"
                                      onClick={() => setTrustlineDialogOpen(true)}
                                      fullWidth
                                      sx={{
                                        py: 1.5,
                                        borderColor: '#000',
                                        color: '#000',
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        '&:hover': {
                                          borderColor: '#000',
                                          bgcolor: 'rgba(0,0,0,0.05)',
                                        },
                                      }}
                                    >
                                      {locale === 'es' ? 'Agregar Trustline USDC' : 'Add USDC Trustline'}
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    variant="contained" 
                                    onClick={handleCryptoClaim} 
                                    disabled={loading || !trustlineStatus?.exists}
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
                                      '&:disabled': {
                                        bgcolor: 'rgba(0,0,0,0.2)',
                                      },
                                    }}
                                  >
                                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t.payment.payWithWallet}
                                  </Button>
                                  
                                  <Button 
                                    variant="text"
                                    onClick={handleDisconnectWallet}
                                    size="small"
                                    sx={{
                                      color: 'rgba(0,0,0,0.5)',
                                      fontSize: '0.75rem',
                                      '&:hover': {
                                        bgcolor: 'transparent',
                                        color: '#000',
                                      },
                                    }}
                                  >
                                    {locale === 'es' ? 'Desconectar wallet' : 'Disconnect wallet'}
                                  </Button>
                                </Stack>
                              </>
                            )}
                          </Box>

                          <Divider />
                          
                          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
                            {locale === 'es' 
                              ? 'Compatible con Freighter, xBull, Lobstr y otras wallets Stellar.'
                              : 'Compatible with Freighter, xBull, Lobstr and other Stellar wallets.'}
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

      {/* Trustline Dialog - Mica Style */}
      <Dialog 
        open={trustlineDialogOpen} 
        onClose={() => !trustlineLoading && setTrustlineDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxWidth: 420,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 255, 0.92) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#000' }}>
          {t.payment.trustlineRequired}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
              {t.payment.trustlineDesc}
            </Typography>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                p: 2, 
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', display: 'block' }}>
                Token
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                {PAYMENT_TOKEN.code} (Stellar Testnet)
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(0,0,0,0.5)', fontSize: '0.65rem', wordBreak: 'break-all' }}>
                {PAYMENT_TOKEN.issuer}
              </Typography>
            </Box>
            {trustlineLoading && <LinearProgress sx={{ borderRadius: 1, bgcolor: 'rgba(0,0,0,0.05)' }} />}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setTrustlineDialogOpen(false)} 
            disabled={trustlineLoading}
            sx={{ color: 'rgba(0,0,0,0.5)' }}
          >
            {t.common.cancel}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddTrustline}
            disabled={trustlineLoading}
            sx={{
              background: 'linear-gradient(135deg, #000 0%, #333 100%)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #222 0%, #444 100%)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              },
            }}
          >
            {trustlineLoading 
              ? <CircularProgress size={20} sx={{ color: '#fff' }} />
              : t.payment.addTrustline
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
