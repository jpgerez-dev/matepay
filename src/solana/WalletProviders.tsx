import React, { ReactNode } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

// Solo devnet. Phantom, Solflare, Backpack y compañía se detectan solas vía Wallet Standard.
const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('devnet');

export const WalletProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
