'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Stack,
  Typography,
  Fade,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useI18n } from '../lib/i18n';
import { useMounted } from '../lib/useMounted';

export default function FAQPage() {
  const { t, locale } = useI18n();
  const mounted = useMounted();

  const faqCategories = [
    {
      title: locale === 'es' ? 'General' : 'General',
      items: [
        {
          q: locale === 'es' ? '¿Qué es PasaTanda?' : 'What is PasaTanda?',
          a: locale === 'es' 
            ? 'PasaTanda es una plataforma que automatiza el "Pasanaku" (también conocido como ROSCA, Tanda o Ahorro Colaborativo). Permite a grupos de amigos o familiares ahorrar dinero de forma rotativa utilizando tecnología Blockchain (Stellar Soroban) para transparencia y custodia, manteniendo una experiencia familiar mediante transferencias bancarias locales (QR) y WhatsApp.'
            : 'PasaTanda is a platform that automates "Pasanaku" (also known as ROSCA, Tanda, or Collaborative Savings). It allows groups of friends or family to save money in a rotating manner using Blockchain technology (Stellar Soroban) for transparency and custody, while maintaining a familiar experience through local bank transfers (QR) and WhatsApp.',
        },
        {
          q: locale === 'es' ? '¿Necesito criptomonedas para empezar?' : 'Do I need cryptocurrency to start?',
          a: locale === 'es'
            ? 'No. Puedes iniciar solo con pagos bancarios (QR). La wallet Stellar es opcional para cobrar en USDC.'
            : 'No. You can start with bank payments only (QR). The Stellar wallet is optional for USDC payouts.',
        },
        {
          q: locale === 'es' ? '¿Dónde se guarda el dinero?' : 'Where is the money stored?',
          a: locale === 'es'
            ? 'La custodia se maneja en contratos inteligentes Soroban (Stellar). La verificación de pagos fiat se realiza mediante el backend PayBE.'
            : 'Custody is handled in Soroban smart contracts (Stellar). Fiat payment verification is done through the PayBE backend.',
        },
      ],
    },
    {
      title: locale === 'es' ? 'Pagos' : 'Payments',
      items: [
        {
          q: locale === 'es' ? '¿Cómo pago mi cuota?' : 'How do I pay my quota?',
          a: locale === 'es'
            ? 'Tienes dos opciones: 1) QR Bancario - Escanea el código QR con tu app bancaria y paga en bolivianos. 2) Stellar Wallet - Paga directamente con USDC usando Freighter u otra wallet compatible.'
            : 'You have two options: 1) Bank QR - Scan the QR code with your banking app and pay in local currency. 2) Stellar Wallet - Pay directly with USDC using Freighter or another compatible wallet.',
        },
        {
          q: locale === 'es' ? '¿Cómo se calculan las cuotas en USDC?' : 'How are USDC quotas calculated?',
          a: locale === 'es'
            ? 'El backend calcula el monto en USDC dinámicamente al generar cada orden, sin fijar un tipo de cambio en la interfaz.'
            : 'The backend calculates the USDC amount dynamically when generating each order, without fixing an exchange rate in the interface.',
        },
        {
          q: locale === 'es' ? '¿Qué wallets son compatibles?' : 'Which wallets are supported?',
          a: locale === 'es'
            ? 'Actualmente soportamos Freighter en navegador para firmas XDR y flujos x402. Pronto se añadirán más wallets con SEP-30.'
            : 'We currently support Freighter in browser for XDR signatures and x402 flows. More wallets will be added soon with SEP-30.',
        },
      ],
    },
    {
      title: locale === 'es' ? 'Rendimientos (DeFi)' : 'Yield (DeFi)',
      items: [
        {
          q: locale === 'es' ? '¿Cómo funcionan los rendimientos?' : 'How does yield generation work?',
          a: locale === 'es'
            ? 'Cuando activas la opción de rendimientos, el dinero acumulado se invierte automáticamente en el protocolo Blend de Stellar. Los intereses generados se distribuyen entre los miembros y la plataforma según configuración.'
            : 'When you enable the yield option, accumulated funds are automatically invested in Stellar\'s Blend protocol. Generated interest is distributed between members and the platform according to configuration.',
        },
        {
          q: locale === 'es' ? '¿Es seguro el protocolo Blend?' : 'Is the Blend protocol safe?',
          a: locale === 'es'
            ? 'Blend es un protocolo DeFi auditado en Stellar. Sin embargo, como cualquier protocolo DeFi, conlleva riesgos. Recomendamos entender estos riesgos antes de activar la opción de rendimientos.'
            : 'Blend is an audited DeFi protocol on Stellar. However, like any DeFi protocol, it carries risks. We recommend understanding these risks before enabling the yield option.',
        },
      ],
    },
    {
      title: locale === 'es' ? 'Grupos y WhatsApp' : 'Groups and WhatsApp',
      items: [
        {
          q: locale === 'es' ? '¿Cómo creo un grupo?' : 'How do I create a group?',
          a: locale === 'es'
            ? 'Ve a la sección de Onboarding, completa el formulario con los datos del grupo, verifica tu número de WhatsApp, y el sistema creará automáticamente un grupo de WhatsApp con un bot asistente.'
            : 'Go to the Onboarding section, complete the form with group data, verify your WhatsApp number, and the system will automatically create a WhatsApp group with an assistant bot.',
        },
        {
          q: locale === 'es' ? '¿Cómo se activa la tanda?' : 'How is the tanda activated?',
          a: locale === 'es'
            ? 'Después de crear el grupo (estado DRAFT), el administrador debe escribir "iniciar tanda" en el grupo de WhatsApp. Esto despliega el contrato inteligente y genera la primera orden de pago.'
            : 'After creating the group (DRAFT state), the administrator must type "iniciar tanda" in the WhatsApp group. This deploys the smart contract and generates the first payment order.',
        },
        {
          q: locale === 'es' ? '¿Qué hace el bot de WhatsApp?' : 'What does the WhatsApp bot do?',
          a: locale === 'es'
            ? 'El bot guía a los miembros con recordatorios de pago, verifica comprobantes, notifica turnos y permite activar la tanda mediante comandos en el chat.'
            : 'The bot guides members with payment reminders, verifies receipts, notifies turns, and allows activating the tanda through chat commands.',
        },
      ],
    },
    {
      title: locale === 'es' ? 'Seguridad' : 'Security',
      items: [
        {
          q: locale === 'es' ? '¿Mis fondos están seguros?' : 'Are my funds safe?',
          a: locale === 'es'
            ? 'Los fondos se almacenan en contratos inteligentes Soroban auditados. Las transacciones requieren firma criptográfica y el sistema nunca tiene acceso a tus llaves privadas.'
            : 'Funds are stored in audited Soroban smart contracts. Transactions require cryptographic signatures and the system never has access to your private keys.',
        },
        {
          q: locale === 'es' ? '¿Qué es x402?' : 'What is x402?',
          a: locale === 'es'
            ? 'x402 es un protocolo de pago que permite firmar transacciones de forma segura sin exponer llaves privadas. Usamos Freighter para generar headers X-PAYMENT que validan pagos criptográficamente.'
            : 'x402 is a payment protocol that allows signing transactions securely without exposing private keys. We use Freighter to generate X-PAYMENT headers that cryptographically validate payments.',
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
    >
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

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
          <Fade in={mounted} timeout={600}>
            <Stack spacing={4}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Chip
                  icon={<HelpOutlineIcon />}
                  label="FAQ"
                  sx={{
                    mb: 2,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#000',
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  {t.faq.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(0,0,0,0.6)',
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto',
                  }}
                >
                  {locale === 'es' 
                    ? 'Encuentra respuestas a las preguntas más comunes sobre PasaTanda'
                    : 'Find answers to the most common questions about PasaTanda'}
                </Typography>
              </Box>

              {/* FAQ Categories */}
              {faqCategories.map((category, categoryIndex) => (
                <Box key={categoryIndex}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#000',
                      mb: 2,
                      pl: 1,
                    }}
                  >
                    {category.title}
                  </Typography>
                  
                  <Stack spacing={1}>
                    {category.items.map((item, itemIndex) => (
                      <Accordion
                        key={itemIndex}
                        elevation={0}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '12px !important',
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': {
                            margin: 0,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              my: 2,
                            },
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, color: '#000' }}>
                            {item.q}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                          <Typography sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
                            {item.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </Box>
              ))}

              {/* Contact CTA */}
              <Box
                sx={{
                  mt: 6,
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
                  {locale === 'es' ? '¿No encontraste lo que buscabas?' : 'Didn\'t find what you were looking for?'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                  {locale === 'es' 
                    ? 'Contáctanos en nuestro grupo de Telegram o envíanos un mensaje por WhatsApp.'
                    : 'Contact us on our Telegram group or send us a message on WhatsApp.'}
                </Typography>
              </Box>
            </Stack>
          </Fade>
        </Container>

        <Footer />
      </Box>
    </Box>
  );
}
