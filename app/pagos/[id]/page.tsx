'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Link as MuiLink,
  SelectChangeEvent,
} from '@mui/material';
import Header from '../../components/Header';
import QRPlaceholder from '../../components/QRPlaceholder';
import Image from 'next/image';
import { DownloadOutlined } from '@mui/icons-material';

// Tipos para los métodos de pago
type PaymentMethod = 'qrsimple' | 'stellar';

interface PaymentData {
  pasanakuName: string;
  month: string;
  amount: string;
  amountUSDC: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qrsimple');

  // Datos de ejemplo para ABC-123
  const paymentData: PaymentData = {
    pasanakuName: 'Fmlia Pasanaku',
    month: 'Enero',
    amount: '100.00',
    amountUSDC: '10',
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar PDF
    console.log('Descargando PDF para pago:', params.id);
  };

  const handlePaidConfirmation = () => {
    // Lógica para confirmar pago QR
    console.log('Usuario confirmó pago QR');
    alert('Gracias por confirmar tu pago. Verificaremos la transacción.');
  };

  const handleStellarPayment = async () => {
    console.log('Iniciando pago con Stellar Wallet');
    
    try {
      // Importación dinámica del servicio Stellar
      const { makePayment } = await import('../../lib/stellar');
      
      // Configurar el pago
      const paymentRequest = {
        amount: paymentData.amountUSDC,
        destination: process.env.NEXT_PUBLIC_STELLAR_DESTINATION || 'DESTINATION_ADDRESS',
        memo: params.id,
        assetCode: 'USDC',
        assetIssuer: process.env.NEXT_PUBLIC_USDC_ISSUER || 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      };
      
      // Ejecutar el pago
      const result = await makePayment(paymentRequest);
      
      if (result.success) {
        alert(`¡Pago exitoso! Hash de transacción: ${result.transactionHash}`);
        console.log('Transacción:', result.transactionHash);
      } else {
        alert(`Error: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Error en pago Stellar:', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ py: 4, px: { xs: 2, sm: 0 } }}>
          {/* Título principal */}
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Pagar Bs. {paymentData.amount}
          </Typography>

          {/* Subtítulo */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1" color="text.secondary">
              a pasanaku
            </Typography>
            <MuiLink href="#" underline="none" sx={{ color: '#1E88E5', fontWeight: 500 }}>
              {paymentData.pasanakuName}
            </MuiLink>
          </Stack>

          {/* Botón Descargar PDF */}
          <Box>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Descargar PDF
            </Button>
          </Box>

          {/* Tarjeta de Resumen */}
          <Box
            sx={{
              bgcolor: '#F5F5F5',
              borderRadius: 2,
              p: 3,
              mt: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {paymentData.pasanakuName}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="body1" color="text.secondary">
                Mes: {paymentData.month}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Bs. {paymentData.amount}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total a pagar
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Bs. {paymentData.amount} ≈ {paymentData.amountUSDC} USDC
              </Typography>
            </Stack>
          </Box>

          {/* Selector de Método de Pago */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Escoge el método de pago que deseas utilizar
            </Typography>

            <FormControl fullWidth>
              <Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                sx={{
                  bgcolor: 'background.default',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E0E0E0',
                  },
                }}
              >
                <MenuItem value="qrsimple">QRsimple (Bolivianos - Bs)</MenuItem>
                <MenuItem value="stellar">Stellar Wallet (USDC)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Renderizado Condicional según el método de pago */}
          <Box sx={{ mt: 4 }}>
            {paymentMethod === 'qrsimple' ? (
              <Stack spacing={3} alignItems="center">
                {/* Código QR */}
                <QRPlaceholder size={250} text="Escanea para pagar" />

                <Button
                  variant="contained"
                  onClick={handlePaidConfirmation}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Ya pagué
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Conecta tu wallet de Stellar para completar el pago en USDC
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={handleStellarPayment}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Pagar con Wallet
                </Button>

                <Typography variant="caption" color="text.secondary" textAlign="center">
                  La verificación del pago será automática en blockchain
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
