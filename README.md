# PasaTanda - Plataforma de Gestión de Pagos Pasanaku

Plataforma web minimalista y de alta confianza para gestionar pagos de "Pasanaku" (ahorro colaborativo) utilizando la blockchain de Stellar.

## 🎨 Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI Library:** Material UI (MUI) v6
- **Blockchain:** Stellar (USDC)
- **Styling:** MUI System (sx prop)
- **Fuente:** Stack Sans Headline (personalizada)

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración de Variables de Entorno

Crea un archivo `.env.local` basado en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_DESTINATION=TU_DIRECCIÓN_STELLAR
NEXT_PUBLIC_USDC_ISSUER=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
bamp-frontend/
├── app/
│   ├── components/
│   │   └── Header.tsx          # Header global con logo
│   ├── lib/
│   │   └── stellar.ts          # Integración Stellar X402
│   ├── pagos/
│   │   ├── [id]/
│   │   │   └── page.tsx        # Página dinámica de pago
│   │   └── page.tsx            # Info de pagos
│   ├── PP/
│   │   └── page.tsx            # Políticas de Privacidad
│   ├── ToS/
│   │   └── page.tsx            # Términos de Servicio
│   ├── layout.tsx              # Layout raíz con tema MUI
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # Provider de MUI Theme
│   └── theme.ts                # Configuración del tema
├── assets/
│   └── fonts/
│       └── StackSansHeadline.ttf
└── public/
    └── assets/
        └── images/
            └── icons/
                └── logotandapaso.png
```

## 🎯 Características Principales

### Rutas

- `/` - Landing Page
- `/pagos` - Información sobre pagos
- `/pagos/[id]` - Página dinámica de pago
- `/pagos/ABC-123` - Ejemplo de pago de prueba
- `/ToS` - Términos de Servicio
- `/PP` - Políticas de Privacidad

### Métodos de Pago

#### 1. QRsimple (Bolivianos - Bs)
- Escaneo de código QR
- Pago en bolivianos
- Confirmación manual del usuario

#### 2. Stellar Wallet (USDC)
- Conexión con Freighter Wallet
- Pago en USDC
- Verificación automática en blockchain

## 🔧 Integración Stellar

El proyecto utiliza Stellar SDK para procesar pagos en USDC:

### Requisitos
- Freighter Wallet instalado en el navegador
- Cuenta Stellar con USDC

### Flujo de Pago
1. Usuario selecciona "Stellar Wallet" como método de pago
2. Click en "Pagar con Wallet"
3. Freighter solicita autorización
4. Transacción se ejecuta en blockchain
5. Verificación automática del pago

### Referencias
- [X402 Stellar Client Documentation](https://www.x402stellar.xyz/docs/core-concepts/x402-stellar-client)
- [Stellar X402 GitHub](https://github.com/mertkaradayi/stellar-x402)

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Principal:** Negro (#000000) y Blanco (#FFFFFF)
- **Error:** Rojo (#FF0000)
- **Warning:** Amarillo (#FFD700)
- **Success:** Verde (#00FF00)

### Principios de Diseño
- Minimalista y serio
- Alta confianza
- Inspirado en la identidad visual de Stellar
- Solo componentes MUI (sin HTML nativo)

## 📝 Página de Pago (`/pagos/[id]`)

### Componentes Principales
- Header con logo PasaTanda
- Título con monto a pagar
- Enlace al Pasanaku
- Botón de descarga de PDF
- Tarjeta de resumen con detalles
- Selector de método de pago
- Renderizado condicional según método seleccionado

### Datos de Ejemplo (ABC-123)
```typescript
{
  pasanakuName: 'Fmlia Pasanaku',
  month: 'Enero',
  amount: '100.00',
  amountUSDC: '10',
}
```

## 🔒 Seguridad

- Sin almacenamiento de claves privadas
- Transacciones firmadas localmente
- Verificación en blockchain
- No hay servidor de pagos centralizado

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
vercel
```

### Build Manual

```bash
npm run build
npm run start
```

## 📄 Licencia

Proyecto privado - Stellar TandaPaso

## 🤝 Contribución

Este proyecto sigue las mejores prácticas de Next.js y Material UI. Por favor, mantén la consistencia del código y el sistema de diseño.

---

**Nota:** Para producción, asegúrate de cambiar `NEXT_PUBLIC_STELLAR_NETWORK` a `public` y configurar las direcciones correctas de destino.

