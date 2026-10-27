import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Увійти в кабінет",
  description: "Авторизація та особистий кабінет клієнта HOLY DRIP.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
