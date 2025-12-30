'use client';

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ISupportedWallet,
} from '@creit.tech/stellar-wallets-kit';
import { Networks, TransactionBuilder, Operation, Asset, Horizon } from '@stellar/stellar-sdk';

// USDC Test Token on BLEND (Testnet)
const USDC_BLEND_TESTNET = {
  contractAddress: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU',
  code: 'USDC',
  issuer: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU',
};

// Singleton wallet kit instance
let walletKitInstance: StellarWalletsKit | null = null;

export type WalletInfo = {
  address: string;
  network: string;
  networkPassphrase: string;
  isConnected: boolean;
};

export type TrustlineStatus = {
  exists: boolean;
  balance?: string;
  limit?: string;
};

/**
 * Get or create the StellarWalletsKit instance
 */
export function getWalletKit(): StellarWalletsKit {
  if (!walletKitInstance) {
    walletKitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return walletKitInstance;
}

/**
 * Open wallet selection modal
 */
export async function openWalletModal(): Promise<void> {
  const kit = getWalletKit();
  await kit.openModal({
    onWalletSelected: async (option: ISupportedWallet) => {
      kit.setWallet(option.id);
    },
  });
}

/**
 * Connect to wallet and get public key
 */
export async function connectWallet(): Promise<WalletInfo> {
  const kit = getWalletKit();
  
  // Open modal if not connected
  const addressResult = await kit.getAddress();
  const address = typeof addressResult === 'string' ? addressResult : addressResult?.address;
  
  if (!address) {
    await openWalletModal();
    // Wait a bit for wallet selection
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAddressResult = await kit.getAddress();
    const newAddress = typeof newAddressResult === 'string' ? newAddressResult : newAddressResult?.address;
    if (!newAddress) {
      throw new Error('No se pudo conectar la wallet');
    }
    return {
      address: newAddress,
      network: 'TESTNET',
      networkPassphrase: Networks.TESTNET,
      isConnected: true,
    };
  }
  
  return {
    address,
    network: 'TESTNET',
    networkPassphrase: Networks.TESTNET,
    isConnected: true,
  };
}

/**
 * Get currently connected address
 */
export async function getConnectedAddress(): Promise<string | null> {
  const kit = getWalletKit();
  try {
    const result = await kit.getAddress();
    return typeof result === 'string' ? result : result?.address || null;
  } catch {
    return null;
  }
}

/**
 * Sign a transaction XDR using the connected wallet
 */
export async function signTransaction(
  xdr: string,
  options?: {
    networkPassphrase?: string;
    address?: string;
  }
): Promise<string> {
  const kit = getWalletKit();
  
  const result = await kit.signTransaction(xdr, {
    networkPassphrase: options?.networkPassphrase || Networks.TESTNET,
    address: options?.address,
  });
  
  return result.signedTxXdr;
}

/**
 * Check if the user has a trustline for USDC BLEND
 */
export async function checkUsdcTrustline(address: string): Promise<TrustlineStatus> {
  const server = new Horizon.Server('https://horizon-testnet.stellar.org');
  
  try {
    const account = await server.loadAccount(address);
    
    // Look for the USDC trustline
    const trustline = account.balances.find(
      (balance) =>
        balance.asset_type !== 'native' &&
        'asset_code' in balance &&
        'asset_issuer' in balance &&
        balance.asset_code === USDC_BLEND_TESTNET.code &&
        balance.asset_issuer === USDC_BLEND_TESTNET.issuer
    );
    
    if (trustline && 'balance' in trustline && 'limit' in trustline) {
      return {
        exists: true,
        balance: trustline.balance,
        limit: trustline.limit,
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking trustline:', error);
    return { exists: false };
  }
}

/**
 * Build a transaction to add USDC trustline
 */
export async function buildAddTrustlineTransaction(address: string): Promise<string> {
  const server = new Horizon.Server('https://horizon-testnet.stellar.org');
  const account = await server.loadAccount(address);
  
  const asset = new Asset(USDC_BLEND_TESTNET.code, USDC_BLEND_TESTNET.issuer);
  
  const transaction = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.changeTrust({
        asset: asset,
        limit: '922337203685.4775807', // Max limit
      })
    )
    .setTimeout(30)
    .build();
  
  return transaction.toXDR();
}

/**
 * Add USDC trustline using the connected wallet
 */
export async function addUsdcTrustline(address: string): Promise<{
  success: boolean;
  txHash?: string;
  error?: string;
}> {
  try {
    const server = new Horizon.Server('https://horizon-testnet.stellar.org');
    
    // Build the trustline transaction
    const xdr = await buildAddTrustlineTransaction(address);
    
    // Sign with wallet
    const signedXdr = await signTransaction(xdr);
    
    // Submit the transaction
    const transaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    const result = await server.submitTransaction(transaction);
    
    return {
      success: true,
      txHash: result.hash,
    };
  } catch (error) {
    console.error('Error adding trustline:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al agregar trustline',
    };
  }
}

/**
 * Build X-PAYMENT header for x402 protocol
 * Based on: https://www.x402stellar.xyz/docs/core-concepts/x402-stellar-client
 */
export async function buildXPayment(
  xdrChallenge: string,
  options?: {
    networkPassphrase?: string;
    address?: string;
  }
): Promise<string> {
  // Sign the XDR challenge
  const signedXdr = await signTransaction(xdrChallenge, options);
  
  // Create the X-PAYMENT payload
  const payload = {
    version: 'x402-stellar-v1',
    scheme: 'exact',
    network: options?.networkPassphrase || Networks.TESTNET,
    payload: {
      signedXdr,
    },
  };
  
  // Encode as base64
  return btoa(JSON.stringify(payload));
}

/**
 * Get wallet network info
 */
export async function getWalletNetwork(): Promise<{
  network: string;
  networkPassphrase: string;
}> {
  const kit = getWalletKit();
  const networkResult = await kit.getNetwork();
  
  // Handle different return types from the API
  let networkString: string;
  if (typeof networkResult === 'string') {
    networkString = networkResult;
  } else if (networkResult && typeof networkResult === 'object' && 'network' in networkResult) {
    networkString = (networkResult as { network: string }).network;
  } else {
    networkString = 'TESTNET';
  }
  
  const isPublic = networkString === WalletNetwork.PUBLIC || networkString === 'PUBLIC';
  
  return {
    network: isPublic ? 'PUBLIC' : 'TESTNET',
    networkPassphrase: isPublic ? Networks.PUBLIC : Networks.TESTNET,
  };
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): void {
  if (walletKitInstance) {
    // Reset to default state
    walletKitInstance = null;
  }
}

export const USDC_TOKEN = USDC_BLEND_TESTNET;
