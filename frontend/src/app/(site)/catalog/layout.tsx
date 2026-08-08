import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог | HOLY DRIP",
  description: "Повний кураторський fashion-архів HOLY DRIP. Rick Owens, Balenciaga, Margiela, Vetements, ERD.",
  openGraph: {
    title: "Каталог | HOLY DRIP",
    description: "Архів дизайнерських речей та рідкісних артефактів.",
  }
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
