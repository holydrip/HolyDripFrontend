import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оформлення замовлення",
  description: "Оформлення та безпечна оплата замовлення в HOLY DRIP.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
