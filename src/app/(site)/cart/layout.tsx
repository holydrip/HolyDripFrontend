import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кошик",
  description: "Ваш кошик замовлення в кураторському архіві HOLY DRIP.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
