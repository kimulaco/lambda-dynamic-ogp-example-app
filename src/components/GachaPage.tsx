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
    if (results === null) {
      router.replace('/');
      return;
    }

    const resultsString = results.join('');
    router.replace(`?results=${resultsString}`);
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