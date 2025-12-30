'use client';

import {
  Box,
  CardContent,
  Container,
  Stack,
  Typography,
  Chip,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import StorageIcon from '@mui/icons-material/Storage';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ParticleBackground from '../../components/ParticleBackground';
import { useI18n } from '../../lib/i18n';
import { useMounted } from '../../lib/useMounted';
import { GlassCard } from '../../components/GlassCard';

function CodeBlock({ code }: { code: string }) {
  return (
    <Box
      component="pre"
      sx={{
        bgcolor: '#1a1a1a',
        color: '#e0e0e0',
        p: 2,
        borderRadius: 2,
        overflow: 'auto',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
      }}
    >
      <code>{code}</code>
    </Box>
  );
}

export default function ContractsDocsPage() {
  const { locale } = useI18n();
  const mounted = useMounted();

  const contracts = [
    {
      name: 'PasanakuFactory',
      address: 'CCYLAWPJM6OVZ222HLPZBE5VLP5HYS43575LI4SCYMGC35JFL2DQUSGD',
      description: locale === 'es'
        ? 'Contrato factory para desplegar instancias estandarizadas de grupos de ahorro'
        : 'Factory contract to deploy standardized savings group instances',
      storage: [
        'GroupWasmHash - BytesN<32>: Hash del WASM de PasanakuGroup',
        'GroupsCreated - Vec<GroupRecord>: Historial de grupos',
        'TotalGroups - u32: Contador total',
        'IsInitialized - bool: Flag de inicialización',
      ],
      functions: [
        {
          name: 'initialize(group_wasm_hash)',
          auth: 'None',
          desc: locale === 'es' ? 'Configura el factory con el WASM del grupo' : 'Configure factory with group WASM',
        },
        {
          name: 'create_group(params, salt)',
          auth: 'None',
          desc: locale === 'es' ? 'Despliega nuevo grupo y lo registra' : 'Deploy new group and register it',
        },
        {
          name: 'get_total_groups()',
          auth: 'None',
          desc: locale === 'es' ? 'Consulta total de grupos creados' : 'Query total groups created',
        },
        {
          name: 'get_all_groups()',
          auth: 'None',
          desc: locale === 'es' ? 'Lista todos los grupos con sus datos' : 'List all groups with their data',
        },
        {
          name: 'compute_group_address(salt)',
          auth: 'None',
          desc: locale === 'es' ? 'Calcula dirección determinística de grupo' : 'Compute deterministic group address',
        },
      ],
    },
    {
      name: 'PasanakuGroup',
      address: 'Deployed per-group',
      description: locale === 'es'
        ? 'Gestiona el ciclo de vida de un grupo de ahorro con integración a Blend para yield'
        : 'Manages savings group lifecycle with Blend integration for yield',
      storage: [
        'Admin - Address: Payment Backend',
        'GroupConfig - { token, amountPerRound, totalMembers }',
        'YieldConfig - { enabled, userShareBps, poolAddress }',
        'TotalPrincipal - i128: Capital neto sin intereses',
        'Members - Vec<MemberStatus>: Estado de pagos',
        'CurrentRound - u32: Ronda actual',
      ],
      functions: [
        {
          name: 'initialize(admin, config, yield_config, members)',
          auth: 'None (llamada por Factory)',
          desc: locale === 'es' ? 'Inicializa grupo con configuración' : 'Initialize group with configuration',
        },
        {
          name: 'deposit_for(from, beneficiary, amount)',
          auth: 'Admin only',
          desc: locale === 'es' ? 'Registra depósito e invierte en Blend' : 'Register deposit and invest in Blend',
        },
        {
          name: 'payout(winner)',
          auth: 'Admin only',
          desc: locale === 'es' ? 'Retira de Blend y paga al ganador' : 'Withdraw from Blend and pay winner',
        },
        {
          name: 'admin_sweep_yield(to)',
          auth: 'Admin only',
          desc: locale === 'es' ? 'Transfiere yield de plataforma' : 'Transfer platform yield',
        },
        {
          name: 'get_config()',
          auth: 'None',
          desc: locale === 'es' ? 'Consulta configuración del grupo' : 'Query group configuration',
        },
        {
          name: 'get_members()',
          auth: 'None',
          desc: locale === 'es' ? 'Lista miembros y estado de pago' : 'List members and payment status',
        },
        {
          name: 'get_estimated_yield()',
          auth: 'None',
          desc: locale === 'es' ? 'Calcula yield estimado acumulado' : 'Calculate estimated accumulated yield',
        },
      ],
    },
  ];

  const blendIntegration = `// Auto-inversión en Blend (deposit)
pool_client.submit(
  &env.current_contract_address(),
  &env.current_contract_address(),
  &env.current_contract_address(),
  &vec![&env, Request {
    request_type: 0, // SupplyCollateral
    address: token_address,
    amount: deposit_amount,
  }]
);

// Retiro con intereses (payout)
pool_client.submit(
  &env.current_contract_address(),
  &env.current_contract_address(),
  &env.current_contract_address(),
  &vec![&env, Request {
    request_type: 1, // WithdrawCollateral
    address: token_address,
    amount: i128::MAX, // Retira todo
  }]
);`;

  const createGroupParams = `CreateGroupParams {
  members: Vec<Address>,      // Lista de miembros
  amount_per_round: i128,     // Monto en stroops (1 USDC = 10_000_000)
  frequency_days: u32,        // Días entre rondas
  enable_yield: bool,         // Activar DeFi
  yield_share_bps: u32,       // % para usuarios (10000 = 100%)
  blend_pool: Address,        // Dirección del pool Blend
}`;

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

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
          <Fade in={mounted} timeout={600}>
            <Stack spacing={4}>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Chip
                  icon={<DataObjectIcon />}
                  label="Smart Contracts"
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
                  Soroban Contracts
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 400 }}>
                  {locale === 'es' 
                    ? 'Documentación de los contratos inteligentes en Stellar Soroban'
                    : 'Smart contract documentation on Stellar Soroban'}
                </Typography>
              </Box>

              {/* Contracts */}
              {contracts.map((contract) => (
                <GlassCard key={contract.name} variant="mica" intensity="subtle" glow>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                      <AccountTreeIcon sx={{ fontSize: 32, color: '#000' }} />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                          {contract.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'monospace' }}>
                          {contract.address}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)', mb: 3 }}>
                      {contract.description}
                    </Typography>

                    {/* Storage */}
                    <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <StorageIcon sx={{ color: '#000' }} />
                          <Typography sx={{ fontWeight: 600 }}>Storage Schema</Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {contract.storage.map((item, idx) => (
                            <ListItem key={idx}>
                              <ListItemText 
                                primary={item} 
                                sx={{ '& .MuiTypography-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>

                    {/* Functions */}
                    <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <FunctionsIcon sx={{ color: '#000' }} />
                          <Typography sx={{ fontWeight: 600 }}>
                            {locale === 'es' ? 'Funciones Públicas' : 'Public Functions'}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {contract.functions.map((fn, idx) => (
                            <ListItem key={idx} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                                <Chip 
                                  label={fn.name} 
                                  size="small" 
                                  sx={{ fontFamily: 'monospace', fontSize: '0.8rem', bgcolor: 'rgba(0,0,0,0.05)' }}
                                />
                              </ListItemIcon>
                              <ListItemText 
                                secondary={
                                  <>
                                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                                      Auth: {fn.auth}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                                      {fn.desc}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </GlassCard>
              ))}

              {/* Blend Integration */}
              <GlassCard variant="mica" intensity="medium">
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
                    {locale === 'es' ? 'Integración con Blend Protocol' : 'Blend Protocol Integration'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 3 }}>
                    {locale === 'es'
                      ? 'Los fondos se invierten automáticamente en Blend para generar rendimiento.'
                      : 'Funds are automatically invested in Blend to generate yield.'}
                  </Typography>
                  <CodeBlock code={blendIntegration} />
                </CardContent>
              </GlassCard>

              {/* Create Group Params */}
              <GlassCard variant="mica" intensity="subtle">
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
                    CreateGroupParams
                  </Typography>
                  <CodeBlock code={createGroupParams} />
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
