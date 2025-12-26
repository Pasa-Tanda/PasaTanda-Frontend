# API de PasaTanda

## Descripción General

PasaTanda es una aplicación frontend que se conecta directamente a la blockchain de Stellar. No hay backend centralizado para procesar pagos. Todas las transacciones se ejecutan de manera descentralizada.

## Integración Frontend

### Servicios Disponibles

#### stellar.ts

Ubicación: `app/lib/stellar.ts`

##### connectWallet()

Conecta con la wallet Freighter del usuario.

```typescript
const publicKey = await connectWallet();
```

**Returns:**
- `string | null` - Public key del usuario o null si falla

**Ejemplo:**
```typescript
const userPublicKey = await connectWallet();
if (userPublicKey) {
  console.log('Usuario conectado:', userPublicKey);
} else {
  console.error('No se pudo conectar');
}
```

---

##### makePayment(request)

Ejecuta un pago en USDC usando Stellar.

```typescript
interface PaymentRequest {
  amount: string;
  destination: string;
  memo?: string;
  assetCode?: string;
  assetIssuer?: string;
}

const result = await makePayment(request);
```

**Parámetros:**
- `amount` (string): Monto a pagar (ej: "10")
- `destination` (string): Dirección Stellar de destino
- `memo` (string, opcional): Memo de la transacción
- `assetCode` (string, opcional): Código del asset (default: "USDC")
- `assetIssuer` (string, opcional): Emisor del asset

**Returns:**
```typescript
interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}
```

**Ejemplo:**
```typescript
const paymentRequest = {
  amount: '100',
  destination: 'GBXXXXXX...',
  memo: 'Pago-ABC-123',
  assetCode: 'USDC',
  assetIssuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
};

const result = await makePayment(paymentRequest);

if (result.success) {
  console.log('Pago exitoso:', result.transactionHash);
  // Verificar en: https://stellar.expert/explorer/public/tx/{transactionHash}
} else {
  console.error('Error:', result.error);
}
```

---

##### verifyPayment(transactionHash)

Verifica el estado de una transacción en Stellar.

```typescript
const isSuccess = await verifyPayment(transactionHash);
```

**Parámetros:**
- `transactionHash` (string): Hash de la transacción a verificar

**Returns:**
- `boolean` - true si la transacción fue exitosa

**Ejemplo:**
```typescript
const hash = '8f7c...';
const verified = await verifyPayment(hash);

if (verified) {
  console.log('Transacción verificada');
}
```

---

##### getUSDCBalance(publicKey)

Obtiene el balance de USDC de una cuenta Stellar.

```typescript
const balance = await getUSDCBalance(publicKey);
```

**Parámetros:**
- `publicKey` (string): Dirección pública Stellar

**Returns:**
- `string` - Balance en USDC (ej: "150.5000000")

**Ejemplo:**
```typescript
const userBalance = await getUSDCBalance('GBXXXXXX...');
console.log('Balance:', userBalance, 'USDC');
```

---

## Rutas de la Aplicación

### GET /

Landing page principal.

**Elementos:**
- Logo PasaTanda
- Descripción de la plataforma
- Botones de navegación
- Enlaces a ToS y PP

---

### GET /pagos

Página informativa sobre métodos de pago.

**Contenido:**
- Explicación de QRsimple
- Explicación de Stellar Wallet
- Guía de uso

---

### GET /pagos/[id]

Página dinámica de pago individual.

**Parámetros:**
- `id` (string): Identificador único del pago

**Componentes:**
- Header con logo
- Título con monto
- Enlace al Pasanaku
- Botón de descarga PDF
- Tarjeta de resumen
- Selector de método de pago
- Área de pago (QR o Wallet)

**Estados:**
- `pending`: Esperando pago
- `processing`: Procesando transacción
- `completed`: Pago completado
- `failed`: Pago fallido

---

### GET /ToS

Términos de Servicio.

---

### GET /PP

Políticas de Privacidad.

---

## Estructura de Datos

### PaymentData

```typescript
interface PaymentData {
  id: string;
  pasanakuName: string;
  month: string;
  amount: string;          // En Bs
  amountUSDC: string;      // En USDC
  status?: PaymentStatus;
  createdAt?: Date;
  completedAt?: Date;
}
```

**Ejemplo:**
```json
{
  "id": "ABC-123",
  "pasanakuName": "Fmlia Pasanaku",
  "month": "Enero",
  "amount": "100.00",
  "amountUSDC": "10",
  "status": "pending"
}
```

---

### Pasanaku

```typescript
interface Pasanaku {
  id: string;
  name: string;
  members: string[];
  monthlyAmount: string;
  totalMonths: number;
  currentMonth: number;
  stellarAddress?: string;
}
```

**Ejemplo:**
```json
{
  "id": "fmlia-001",
  "name": "Fmlia Pasanaku",
  "members": ["GBXXX...", "GBYYYY..."],
  "monthlyAmount": "100.00",
  "totalMonths": 12,
  "currentMonth": 1,
  "stellarAddress": "GBZZZ..."
}
```

---

## Flujo de Pago Completo

### Método QRsimple

1. Usuario navega a `/pagos/[id]`
2. Selecciona "QRsimple (Bolivianos - Bs)"
3. Escanea el código QR con su app bancaria
4. Realiza el pago en bolivianos
5. Hace clic en "Ya pagué"
6. Sistema registra la confirmación manual
7. Administrador verifica el pago offline

### Método Stellar Wallet

1. Usuario navega a `/pagos/[id]`
2. Selecciona "Stellar Wallet (USDC)"
3. Hace clic en "Pagar con Wallet"
4. Sistema llama a `connectWallet()`
5. Freighter solicita autorización
6. Usuario autoriza la conexión
7. Sistema crea `PaymentRequest`
8. Sistema llama a `makePayment(request)`
9. Freighter muestra detalles de la transacción
10. Usuario confirma con su PIN
11. Transacción se ejecuta en blockchain
12. Sistema recibe `transactionHash`
13. Sistema verifica con `verifyPayment(hash)`
14. Pago confirmado automáticamente

---

## Variables de Entorno

### Desarrollo

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_DESTINATION=GBTEST...
NEXT_PUBLIC_USDC_ISSUER=GATESTISSUER...
```

### Producción

```env
NEXT_PUBLIC_STELLAR_NETWORK=public
NEXT_PUBLIC_STELLAR_DESTINATION=GBPROD...
NEXT_PUBLIC_USDC_ISSUER=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
```

---

## Manejo de Errores

### Errores Comunes

#### "Freighter wallet no está instalada"

```typescript
try {
  const publicKey = await connectWallet();
} catch (error) {
  if (error.message.includes('Freighter')) {
    alert('Por favor instala Freighter Wallet');
    window.open('https://www.freighter.app/', '_blank');
  }
}
```

#### "No se pudo conectar con la wallet"

Usuario no autorizó la conexión.

**Solución:**
- Reintentar conexión
- Verificar que Freighter esté desbloqueado

#### "Fondos insuficientes"

Usuario no tiene suficiente USDC o XLM.

**Solución:**
- Mostrar balance actual
- Indicar monto necesario
- Proporcionar link para comprar USDC

---

## Testing

### Testnet

1. Configura `.env.local` con `testnet`
2. Crea cuenta en https://laboratory.stellar.org/#account-creator
3. Agrega trustline para USDC testnet
4. Realiza pagos de prueba

### Mainnet

1. Configura `.env.local` con `public`
2. Usa cuenta real con USDC
3. Verifica direcciones de destino
4. Realiza pago pequeño de prueba primero

---

## Seguridad

### Mejores Prácticas

1. **Nunca almacenar claves privadas**
   - Solo usar Freighter para firmar
   - No guardar seeds en localStorage

2. **Verificar direcciones**
   - Siempre mostrar dirección completa de destino
   - Permitir copiar para verificar

3. **Validar montos**
   - Verificar que el monto sea positivo
   - Limitar decimales a 7 (Stellar standard)

4. **Rate Limiting**
   - Evitar múltiples transacciones simultáneas
   - Esperar confirmación antes de permitir otra

---

## Webhooks (Futuro)

Actualmente no hay webhooks. Todas las verificaciones son on-chain.

Para implementar webhooks:

1. Configurar Horizon watcher
2. Escuchar eventos de pago
3. Filtrar por dirección de destino
4. Verificar memos
5. Actualizar estado en DB

---

## Recursos Externos

### APIs Utilizadas

- **Horizon API**: https://horizon.stellar.org
- **Horizon Testnet**: https://horizon-testnet.stellar.org

### Exploradores

- **Stellar Expert**: https://stellar.expert/
- **StellarChain**: https://stellarchain.io/

### Documentación

- **Stellar SDK**: https://stellar.github.io/js-stellar-sdk/
- **Freighter**: https://docs.freighter.app/
- **X402**: https://www.x402stellar.xyz/

---

## Soporte

Para preguntas técnicas sobre la integración:
- Revisa la documentación de Stellar
- Consulta los ejemplos en el código fuente
- Usa Stellar StackExchange

Para problemas específicos de PasaTanda:
- Revisa los logs del navegador (Console)
- Verifica la configuración de variables de entorno
- Consulta la guía de desarrollo (DEVELOPMENT.md)
