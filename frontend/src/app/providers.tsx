"use client";

import { CartProvider } from "@/context/CartContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { useLocaleStore } from '@/store/locale.store';
import { useEffect } from 'react';

function LocaleBodyClass() {
    const { locale } = useLocaleStore();
    useEffect(() => {
        document.body.classList.remove('lang-uk', 'lang-en');
        document.body.classList.add(`lang-${locale || 'uk'}`);
    }, [locale]);
    return null;
}

interface ProvidersProps {
    children: ReactNode
}

export function Providers({children}: ProvidersProps) {
    const queryClient = new QueryClient();
    return (
        <AppRouterCacheProvider>
            <QueryClientProvider client={queryClient}>
                <CartProvider>
                    <LocaleBodyClass />
                    {children}
                    <Toaster position="top-center"/>

                </CartProvider>
            </QueryClientProvider>
        </AppRouterCacheProvider>
    );
}
