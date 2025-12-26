/**
 * Tipos globales de la aplicación PasaTanda
 */

// Métodos de pago disponibles
export type PaymentMethod = 'qrsimple' | 'stellar';

// Estado de pago
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Datos de un pago
export interface PaymentData {
  id: string;
  pasanakuName: string;
  month: string;
  amount: string;
  amountUSDC: string;
  status?: PaymentStatus;
  createdAt?: Date;
  completedAt?: Date;
}

// Datos de un Pasanaku
export interface Pasanaku {
  id: string;
  name: string;
  members: string[];
  monthlyAmount: string;
  totalMonths: number;
  currentMonth: number;
  stellarAddress?: string;
}

// Respuesta de la API de pago
export interface PaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  message?: string;
}

// Configuración de Stellar
export interface StellarConfig {
  network: 'testnet' | 'public';
  destinationAddress: string;
  usdcIssuer: string;
  horizonUrl: string;
}

// Usuario conectado
export interface ConnectedUser {
  publicKey: string;
  balance?: string;
  hasUSDCTrustline?: boolean;
}

// Declaración de tipos para la ventana (Freighter)
declare global {
  interface Window {
    freighter?: {
      getPublicKey(): Promise<string>;
      signTransaction(xdr: string, options: {
        network: string;
        accountToSign: string;
      }): Promise<string>;
      isConnected(): Promise<boolean>;
    };
  }
}

export {};
