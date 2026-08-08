import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  // We can fetch category info here if we have a server-side service, 
  // but for now we provide a generic dynamic title.
  // Example: if id is 'shoes', title is 'Каталог: shoes'
  const formattedId = id.charAt(0).toUpperCase() + id.slice(1);

  return {
    title: `${formattedId} | Каталог`,
    description: `Архівні речі та дизайнерський одяг у категорії ${formattedId}. HOLY DRIP.`,
    openGraph: {
      title: `${formattedId} | HOLY DRIP Каталог`,
      description: `Кураторський архів. Категорія: ${formattedId}.`
    }
  };
}

export default function CatalogCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
