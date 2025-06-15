"use client";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { TokenLaunchpad } from './Components/withMetaAndMint/TokenLaunchpad';

export default function Home() {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 20,
            background:"black"
          }}>
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <TokenLaunchpad/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
