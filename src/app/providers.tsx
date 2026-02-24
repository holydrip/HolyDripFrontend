"use client";

import { CartProvider } from "@/context/CartContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
    children: ReactNode
}

export function Providers({children}: ProvidersProps) {
    const queryClient = new QueryClient();
    return (
        <AppRouterCacheProvider>
            <QueryClientProvider client={queryClient}>
                <CartProvider>
                    {children}
                    <Toaster position="top-center"/>

                </CartProvider>
            </QueryClientProvider>
        </AppRouterCacheProvider>
    );
}
