import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantle, foundry } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'AurumNet',
    projectId: 'YOUR_PROJECT_ID', // Get one at https://cloud.walletconnect.com
    chains: [mantle, foundry],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
