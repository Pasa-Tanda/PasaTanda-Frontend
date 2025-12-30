import { getNetworkDetails, isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { Networks } from '@stellar/stellar-sdk';
import { createFreighterSigner, createPaymentHeader, PaymentRequirements } from 'x402-stellar-client';

type NetworkName = 'PUBLIC' | 'TESTNET' | 'FUTURENET' | 'STANDALONE';

export type XPaymentResult = {
  xPayment: string;
  signer: string;
  network: NetworkName;
};

const defaultNetwork = (): NetworkName => {
  const envNet = process.env.NEXT_PUBLIC_STELLAR_NETWORK?.toUpperCase();
  if (envNet === 'PUBLIC' || envNet === 'TESTNET' || envNet === 'FUTURENET' || envNet === 'STANDALONE') return envNet;
  return 'TESTNET';
};

export async function ensureFreighterConnection() {
  // isConnected returns a boolean directly in newer API
  const connectionResult = await isConnected();
  const connected = typeof connectionResult === 'boolean' 
    ? connectionResult 
    : (connectionResult as { isConnected?: boolean })?.isConnected;
  
  if (!connected) {
    throw new Error('Instala o habilita Freighter para continuar');
  }

  // requestAccess returns address string or object with address/error
  const accessResult = await requestAccess();
  const address = typeof accessResult === 'string' 
    ? accessResult 
    : (accessResult as { address?: string; error?: string })?.address;
  const accessError = typeof accessResult === 'object' 
    ? (accessResult as { error?: string })?.error 
    : undefined;

  if (accessError || !address) {
    throw new Error(accessError || 'No se pudo obtener la dirección de Freighter');
  }

  const networkDetails = await getNetworkDetails();
  const networkName = typeof networkDetails === 'string' 
    ? networkDetails 
    : (networkDetails as { network?: string })?.network;
  const networkPassphrase = typeof networkDetails === 'object' 
    ? (networkDetails as { networkPassphrase?: string })?.networkPassphrase 
    : undefined;
  
  const selectedNetwork = (networkName as NetworkName) || defaultNetwork();

  return {
    address,
    network: selectedNetwork,
    networkPassphrase: networkPassphrase || (selectedNetwork === 'PUBLIC' ? Networks.PUBLIC : Networks.TESTNET),
  };
}

export async function signChallengeXdr(xdr: string, network: NetworkName, address?: string) {
  // Use accountToSign instead of address for newer Freighter API
  const signed = await signTransaction(xdr, { network, accountToSign: address });
  if ((signed as { error?: string }).error) {
    const err = (signed as { error?: string | { message?: string } }).error;
    throw new Error(typeof err === 'string' ? err : (err as { message?: string })?.message || 'No se pudo firmar el XDR');
  }
  // signedTxXdr or direct string return depending on API version
  const signedXdr = typeof signed === 'string' 
    ? signed 
    : (signed as { signedTxXdr?: string }).signedTxXdr;
  return signedXdr as string;
}

export async function createXPaymentFromRequirements(requirements: PaymentRequirements): Promise<XPaymentResult> {
  const freighter = await ensureFreighterConnection();
  const signer = createFreighterSigner();
  const xPayment = await createPaymentHeader({ signer, paymentRequirements: requirements });
  return { xPayment, signer: freighter.address, network: freighter.network };
}

export async function buildXPaymentFromChallenge(xdr: string): Promise<XPaymentResult> {
  const freighter = await ensureFreighterConnection();
  const xPayment = await signChallengeXdr(xdr, freighter.network, freighter.address);
  return { xPayment, signer: freighter.address, network: freighter.network };
}
