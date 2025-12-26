# Guía de Desarrollo - PasaTanda

## Arquitectura del Proyecto

### Estructura de Carpetas

```
app/
├── components/        # Componentes reutilizables
│   ├── Header.tsx     # Header global
│   └── QRPlaceholder.tsx  # Placeholder para códigos QR
├── lib/              # Servicios y utilidades
│   └── stellar.ts    # Integración con Stellar
├── types/            # Definiciones TypeScript
│   └── index.ts      # Tipos globales
├── pagos/            # Rutas de pagos
│   ├── [id]/        # Página dinámica de pago
│   └── page.tsx     # Info general
├── layout.tsx        # Layout raíz
├── providers.tsx     # Providers de MUI
└── theme.ts          # Configuración del tema
```

## Sistema de Diseño

### Principios
1. **Solo MUI Components**: No usar etiquetas HTML nativas
2. **Monocromático**: Negro y blanco predominantes
3. **Minimalista**: Diseño limpio y serio
4. **Responsive**: Mobile-first con breakpoints de MUI

### Componentes Principales

#### Box
```tsx
<Box sx={{ bgcolor: 'background.default', p: 2 }}>
  {/* contenido */}
</Box>
```

#### Stack
```tsx
<Stack spacing={2} direction="row">
  {/* elementos */}
</Stack>
```

#### Typography
```tsx
<Typography variant="h1" component="h1">
  Título
</Typography>
```

### Sistema de Espaciado
- Usa `spacing` de MUI (1 unidad = 8px)
- Valores comunes: 1, 2, 3, 4, 6, 8

### Paleta de Colores
```typescript
{
  primary: '#000000',
  secondary: '#FFFFFF',
  error: '#FF0000',
  warning: '#FFD700',
  success: '#00FF00',
  text: {
    primary: '#000000',
    secondary: '#666666',
  }
}
```

## Integración con Stellar

### Flujo de Pago

1. **Usuario hace clic en "Pagar con Wallet"**
   ```tsx
   const handleStellarPayment = async () => {
     const { makePayment } = await import('../../lib/stellar');
     // ...
   };
   ```

2. **Se crea la solicitud de pago**
   ```typescript
   const paymentRequest = {
     amount: '10',
     destination: 'G...',
     memo: 'ABC-123',
     assetCode: 'USDC',
     assetIssuer: 'G...',
   };
   ```

3. **Se ejecuta la transacción**
   ```typescript
   const result = await makePayment(paymentRequest);
   ```

4. **Se verifica el resultado**
   ```typescript
   if (result.success) {
     // Pago exitoso
   } else {
     // Error
   }
   ```

### Funciones Disponibles

#### `connectWallet()`
Conecta con Freighter y retorna la public key del usuario.

#### `makePayment(request)`
Ejecuta un pago en USDC.

#### `verifyPayment(hash)`
Verifica el estado de una transacción.

#### `getUSDCBalance(publicKey)`
Obtiene el balance de USDC de una cuenta.

## Crear Nuevas Páginas

### Página Estática

```tsx
// app/nueva-pagina/page.tsx
'use client';

import { Box, Container, Typography } from '@mui/material';
import Header from '../components/Header';

export default function NuevaPagina() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h2">
          Nueva Página
        </Typography>
      </Container>
    </Box>
  );
}
```

### Página Dinámica

```tsx
// app/items/[id]/page.tsx
export default function ItemPage({ params }: { params: { id: string } }) {
  // Acceder a params.id
  return (
    // JSX
  );
}
```

## Crear Nuevos Componentes

### Componente Básico

```tsx
// app/components/MiComponente.tsx
'use client';

import { Box, Typography } from '@mui/material';

interface MiComponenteProps {
  title: string;
  description?: string;
}

export default function MiComponente({ 
  title, 
  description 
}: MiComponenteProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">{title}</Typography>
      {description && (
        <Typography variant="body2">{description}</Typography>
      )}
    </Box>
  );
}
```

### Uso del Componente

```tsx
import MiComponente from './components/MiComponente';

<MiComponente 
  title="Título" 
  description="Descripción opcional" 
/>
```

## Estado y Hooks

### useState

```tsx
const [value, setValue] = useState<string>('');

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### useEffect

```tsx
useEffect(() => {
  // Lógica
  
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

## Manejo de Formularios

### Select

```tsx
const [method, setMethod] = useState<PaymentMethod>('qrsimple');

<FormControl fullWidth>
  <Select
    value={method}
    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
  >
    <MenuItem value="qrsimple">QRsimple</MenuItem>
    <MenuItem value="stellar">Stellar</MenuItem>
  </Select>
</FormControl>
```

### Button con Loading

```tsx
const [loading, setLoading] = useState(false);

<Button
  variant="contained"
  onClick={async () => {
    setLoading(true);
    try {
      await doSomething();
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
>
  {loading ? 'Procesando...' : 'Confirmar'}
</Button>
```

## Buenas Prácticas

### TypeScript
- Siempre define tipos para props
- Usa interfaces en lugar de types cuando sea posible
- Evita `any`, usa `unknown` si es necesario

### MUI
- Usa `sx` prop para estilos inline
- Aprovecha el sistema de breakpoints
- Usa `Stack` en lugar de `Box` con flexbox manual

### Stellar
- Siempre maneja errores en transacciones
- Verifica que Freighter esté instalado antes de usarlo
- Muestra mensajes claros al usuario

### Performance
- Usa `'use client'` solo cuando sea necesario
- Implementa lazy loading para componentes pesados
- Optimiza imágenes con Next.js Image

## Testing

### Probar Localmente

```bash
npm run dev
```

Visita:
- http://localhost:3000 - Landing
- http://localhost:3000/pagos/ABC-123 - Ejemplo de pago

### Build de Producción

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Variables de Entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_DESTINATION=G...
NEXT_PUBLIC_USDC_ISSUER=G...
```

Acceder en código:

```typescript
const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
```

## Debugging

### Console Logs
```tsx
console.log('Debug:', { variable });
```

### React DevTools
Instala la extensión de React DevTools en tu navegador.

### Network Tab
Revisa las llamadas a Horizon en la pestaña Network.

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático en cada push

### Manual

```bash
npm run build
```

Sube la carpeta `.next` a tu servidor.

## Recursos

- **Next.js Docs:** https://nextjs.org/docs
- **MUI Docs:** https://mui.com/material-ui/
- **Stellar Docs:** https://developers.stellar.org/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

## Contribuir

1. Crea una rama feature
2. Implementa tus cambios
3. Asegúrate que compile sin errores
4. Haz commit con mensajes descriptivos
5. Crea un Pull Request
