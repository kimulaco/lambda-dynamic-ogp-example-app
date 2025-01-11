import { useState, useMemo } from "react";

export type GachaResult = 0 | 1 | 2;

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const useGacha = ({ initialGachaCount }: { initialGachaCount?: number }) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [gachaCount, setGachaCount] = useState<number>(initialGachaCount || 10);

  const drawCount = useMemo<number>(() => {
    if (typeof gachaCount !== "number") {
      setIsInvalid(true);
      return 10;
    }
    if (gachaCount < 10) {
      setIsInvalid(true);
      return 10;
    }
    if (gachaCount > 100) {
      setIsInvalid(true);
      return 100;
    }
    setIsInvalid(false);
    return gachaCount;
  }, [gachaCount]);

  const draw = async (): Promise<GachaResult[] | null> => {
    if (drawCount < 10 || drawCount > 100) {
      return null;
    }
    if (isDrawing) {
      return null;
    }

    setIsDrawing(true);

    const results: GachaResult[] = [];
    for (let i = 0; i < drawCount; i++) {
      results.push(gacha());
    }

    await delay(1000);

    setIsDrawing(false);

    return results;
  };

  const gacha = (): GachaResult => {
    const random = Math.random() * 100;
    if (random < 1) {
      return 2;
    }
    if (random < 6) {
      return 1;
    }
    return 0;
  };

  return {
    isDrawing,
    isInvalid,
    gachaCount,
    setGachaCount,
    drawCount,
    draw,
  };
};
