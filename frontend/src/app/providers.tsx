"use client";

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/config';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={{
                        lightMode: lightTheme({
                            accentColor: '#10b981', // Emerald-500
                            borderRadius: 'medium',
                        }),
                        darkMode: darkTheme({
                            accentColor: '#10b981', // Emerald-500
                            borderRadius: 'medium',
                        }),
                    }}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
