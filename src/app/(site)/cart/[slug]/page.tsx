import { permanentRedirect } from "next/navigation";

export default async function OldCartSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/product/${slug}`);
}