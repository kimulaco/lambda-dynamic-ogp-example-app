"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useGacha, type GachaResult } from "@/hooks/useGacha";
import styles from "./Gacha.module.css";
import { useShareModal } from "@/components/ShareModal";

interface GachaProps {
  onGachaResults?: (results: GachaResult[] | null) => void;
  initialResults?: GachaResult[] | null;
}

export const Gacha = ({ onGachaResults, initialResults }: GachaProps) => {
  const searchParams = useSearchParams();
  const { isDrawing, isInvalid, gachaCount, setGachaCount, drawCount, draw } = useGacha({
    initialGachaCount: initialResults?.length,
  });
  const [gachaResults, setGachaResults] = useState<GachaResult[] | null>(initialResults || null);
  const { ShareModal, setIsOpen } = useShareModal();

  // URLパラメータから初期値を設定
  useEffect(() => {
    const count = searchParams.get('count');
    if (count) {
      const numCount = Number(count);
      if (!isNaN(numCount)) {
        setGachaCount(numCount);
      }
    }
  }, [searchParams, setGachaCount]);

  // 初期値が変更されたら反映
  useEffect(() => {
    if (initialResults) {
      setGachaResults(initialResults);
    }
  }, [initialResults]);

  const handleChangeGachaCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number(e.target.value);
    if (isNaN(count)) {
      return;
    }
    setGachaCount(count);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const results = await draw();
    setGachaResults(results);
    if (onGachaResults && Array.isArray(results)) {
      onGachaResults(results);
    }
  };

  const handleClearResults = () => {
    setGachaResults(null);

    if (onGachaResults) {
      onGachaResults(null);
    }
  };

  const handleClickShare = () => {
    setIsOpen(true);
  };

  return (
    <div className={styles.container}>
      <form noValidate onSubmit={handleSubmit}>
        <div className={styles.description}>
          <ul className={styles.description_list}>
            <li>1%の確率で大当たり</li>
            <li>5%の確率で小当たり</li>
            <li>1度につき10〜100回ガチャれます</li>
            <li>天井なし</li>
          </ul>
        </div>

        <div className={styles.input_group}>
          <label
            htmlFor="count"
            className={styles.input_label}
          >ガチャを引く数:</label>
          <input
            type="number"
            name="count"
            className={styles.input}
            value={gachaCount}
            aria-invalid={isInvalid}
            onChange={handleChangeGachaCount}
          />
        </div>

        {isInvalid && (
          <p className={styles.error_message}>10〜100の範囲で入力してください</p>
        )}

        <div className={styles.button_group}>
          <button
            type="submit"
            className={styles.button}
            disabled={isDrawing || isInvalid}
          >
            {isDrawing ? `${drawCount}回ガチャ中...` : `${drawCount}回ガチャる！`}
          </button>
          {!isDrawing && gachaResults && (
            <button
              type="button"
              className={styles.button}
              onClick={handleClearResults}
            >
              結果をクリア
            </button>
          )}
        </div>
      </form>

      {isDrawing && (
        <div className={styles.result}>
          <p>ガチャ中...</p>
        </div>
      )}

      {!isDrawing && gachaResults && (
        <div className={styles.result}>
          <h2 id="gacha_result">ガチャ結果</h2>
          <p className={styles.result_count}>{gachaResults.length}回ガチャしました</p>
          <button
            type="button"
            className={styles.share_button}
            onClick={handleClickShare}
          >
            結果をシェアする
          </button>
          <ul className={styles.result_list}>
            {gachaResults.map((result, index) => {
              if (Number(result) === 2) {
                return <Image src="/gacha/result/r2.png" alt="大当たり" key={index} width={100} height={100} />
              }
              if (Number(result) === 1) {
                return <Image src="/gacha/result/r1.png" alt="小当たり" key={index} width={100} height={100} />
              }
              return <Image src="/gacha/result/r0.png" alt="はずれ" key={index} width={100} height={100} />
            })}
          </ul>
        </div>
      )}

      <ShareModal
        results={(gachaResults || []).join('')}
      />
    </div>
  );
}

