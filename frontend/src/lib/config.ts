import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantle, foundry } from 'wagmi/chains';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (walletConnectProjectId === 'YOUR_PROJECT_ID') {
    console.warn('⚠️  WalletConnect Project ID not set. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file');
}

export const config = getDefaultConfig({
    appName: 'AurumNet',
    projectId: walletConnectProjectId,
    chains: [mantle, foundry],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
