import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Повний кураторський fashion-архів HOLY DRIP. Rick Owens, Balenciaga, Margiela, Vetements, ERD.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Каталог | HOLY DRIP",
    description: "Архів дизайнерських речей та рідкісних артефактів.",
    url: "https://holydrip.com.ua/catalog",
  }
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
