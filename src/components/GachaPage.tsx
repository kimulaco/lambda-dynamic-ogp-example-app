"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import { Gacha } from "@/components/Gacha";
import type { GachaResult } from "@/hooks/useGacha";

interface GachaPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const GachaPage = ({ searchParams }: GachaPageProps) => {
  const router = useRouter();
  const [initialResults, setInitialResults] = useState<GachaResult[] | null>(null);

  useEffect(() => {
    const results = searchParams.results;
    if (results) {
      const resultsArray = (Array.isArray(results) ? results[0] : results)
        .split('')
        .map(Number) as GachaResult[];
      setInitialResults(resultsArray);
    }
  }, [searchParams]);

  const handleGachaResults = (results: GachaResult[] | null) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'results' && value !== undefined) {
        params.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    if (results === null) {
      params.delete('results');
    } else {
      const resultsString = results.join('');
      params.set('results', resultsString);
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>動的OGPテスト</h1>
      </header>

      <main className={styles.main}>
        <Gacha onGachaResults={handleGachaResults} initialResults={initialResults} />
      </main>
    </div>
  );
};