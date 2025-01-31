'use client';

import { createAppKit } from '@reown/appkit';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// import { mainnet, arbitrum, sepolia, solana, solanaTestnet, solanaDevnet,AppKitNetwork } from '@reown/appkit/networks';
import { mainnet, solana,solanaDevnet, AppKitNetwork } from '@reown/appkit/networks';
 
import { SolflareWalletAdapter, PhantomWalletAdapter, SafePalWalletAdapter } from '@solana/wallet-adapter-wallets';

// Supported networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [ solana,solanaDevnet,   mainnet];

// Project ID from .env
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
});

// Create Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new SafePalWalletAdapter()],
});

// Metadata
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // Replace with your app's domain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

//Create AppKit modal
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});


 