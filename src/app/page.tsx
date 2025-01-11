"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Gacha } from "@/components/Gacha";
import type { GachaResult } from "@/hooks/useGacha";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialResults, setInitialResults] = useState<GachaResult[] | null>(null);

  useEffect(() => {
    const results = searchParams.get('results');
    if (results) {
      // 文字列を配列に変換
      const resultsArray = results.split('').map(Number) as GachaResult[];
      setInitialResults(resultsArray);
    }
  }, [searchParams]);

  const handleGachaResults = (results: GachaResult[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const resultsString = results.join('');
    params.set('results', resultsString);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>動的OGPテキスト</h1>
      </header>

      <main className={styles.main}>
        <Gacha onGachaResults={handleGachaResults} initialResults={initialResults} />
      </main>
    </div>
  );
}
