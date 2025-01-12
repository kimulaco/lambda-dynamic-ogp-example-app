import { Metadata } from "next";
import { GachaPage } from "@/components/GachaPage";

export const generateMetadata = async ({ searchParams }: {
  searchParams: any
}): Promise<Metadata> => {
  const params = await searchParams;
  const results = params.results;
  const ogImageUrl = `https://d3dzv36ke8syqj.cloudfront.net/ogp/gacha`;

  return {
    openGraph: {
      type: 'website',
      siteName: '動的OGPテスト',
      title: '動的OGPテスト',
      description: '動的OGPテストでガチャをしよう！',
      images: [{
        url: `${ogImageUrl}${results ? `?results=${results.toString()}` : ''}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
};

export default async function Home({
  searchParams,
}: {
  searchParams: any
}) {
  const params = await searchParams;
  return <GachaPage searchParams={params} />;
}
