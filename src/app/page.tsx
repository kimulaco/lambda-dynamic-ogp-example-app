import { Metadata } from "next";
import { GachaPage } from "@/components/GachaPage";

export const generateMetadata = async ({ searchParams }: {
  searchParams: any
}): Promise<Metadata> => {
  const params = await searchParams;
  const results = params.results;
  const ogImageUrl = `https://noh88ekwx1.execute-api.ap-northeast-1.amazonaws.com/dev/ogp/gacha`;

  return {
    title: '動的OGPテスト',
    description: '動的OGPテストの説明文',
    openGraph: {
      title: '動的OGPテスト',
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
