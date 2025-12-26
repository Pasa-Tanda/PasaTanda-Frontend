/**
 * Stellar X402 Payment Integration
 * 
 * Basado en la documentación:
 * - https://www.x402stellar.xyz/docs/core-concepts/x402-stellar-client
 * - https://github.com/mertkaradayi/stellar-x402
 */

import * as StellarSdk from 'stellar-sdk';

// Configuración de la red Stellar (usar testnet para desarrollo)
const isTestnet = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'testnet';
const server = new StellarSdk.Horizon.Server(
  isTestnet
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org'
);

export interface PaymentRequest {
  amount: string;
  destination: string;
  memo?: string;
  assetCode?: string;
  assetIssuer?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Conecta con la wallet del usuario usando Freighter o similar
 */
export async function connectWallet(): Promise<string | null> {
  try {
    // Verificar si Freighter está instalado
    if (typeof window !== 'undefined' && (window as any).freighter) {
      const publicKey = await (window as any).freighter.getPublicKey();
      return publicKey;
    } else {
      throw new Error('Freighter wallet no está instalada');
    }
  } catch (error) {
    console.error('Error al conectar wallet:', error);
    return null;
  }
}

/**
 * Realiza un pago en USDC usando Stellar
 */
export async function makePayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const sourcePublicKey = await connectWallet();
    
    if (!sourcePublicKey) {
      return {
        success: false,
        error: 'No se pudo conectar con la wallet',
      };
    }

    // Cargar la cuenta del usuario
    const account = await server.loadAccount(sourcePublicKey);

    // Definir el asset (USDC)
    const asset = request.assetCode && request.assetIssuer
      ? new StellarSdk.Asset(request.assetCode, request.assetIssuer)
      : new StellarSdk.Asset(
          'USDC',
          'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' // USDC issuer en mainnet
        );

    // Construir la transacción
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: isTestnet
        ? StellarSdk.Networks.TESTNET
        : StellarSdk.Networks.PUBLIC,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: request.destination,
          asset: asset,
          amount: request.amount,
        })
      )
      .setTimeout(180);

    // Agregar memo si existe
    if (request.memo) {
      transaction.addMemo(StellarSdk.Memo.text(request.memo));
    }

    const builtTransaction = transaction.build();

    // Firmar con Freighter
    if (typeof window !== 'undefined' && (window as any).freighter) {
      const signedTransaction = await (window as any).freighter.signTransaction(
        builtTransaction.toXDR(),
        {
          network: isTestnet ? 'TESTNET' : 'PUBLIC',
          accountToSign: sourcePublicKey,
        }
      );

      // Enviar la transacción
      const transactionResult = await server.submitTransaction(
        StellarSdk.TransactionBuilder.fromXDR(
          signedTransaction,
          isTestnet
            ? StellarSdk.Networks.TESTNET
            : StellarSdk.Networks.PUBLIC
        )
      );

      return {
        success: true,
        transactionHash: transactionResult.hash,
      };
    }

    return {
      success: false,
      error: 'No se pudo firmar la transacción',
    };
  } catch (error: any) {
    console.error('Error al procesar el pago:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
}

/**
 * Verifica el estado de una transacción
 */
export async function verifyPayment(
  transactionHash: string
): Promise<boolean> {
  try {
    const transaction = await server.transactions()
      .transaction(transactionHash)
      .call();

    return transaction.successful;
  } catch (error) {
    console.error('Error al verificar pago:', error);
    return false;
  }
}

/**
 * Obtiene el balance de USDC de una cuenta
 */
export async function getUSDCBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    
    const usdcBalance = account.balances.find(
      (balance: any) =>
        balance.asset_code === 'USDC' &&
        balance.asset_issuer === 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
    );

    return usdcBalance ? usdcBalance.balance : '0';
  } catch (error) {
    console.error('Error al obtener balance:', error);
    return '0';
  }
}
