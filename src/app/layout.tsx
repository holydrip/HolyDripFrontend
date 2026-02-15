import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Holy Dip",
    description: "Holy Dip shop",
    icons: {
        icon: "/images/logo.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
