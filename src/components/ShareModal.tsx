"use client";

import { useState, useMemo } from "react";
import styles from "./ShareModal.module.css";

interface ShareModalProps {
  isOpen: boolean;
  results: string;
  onClickOverlay?: () => void;
  onClose?: () => void;
}

const OGP_URL = 'https://d3dzv36ke8syqj.cloudfront.net/ogp/gacha';

export const ShareModal = ({
  isOpen = false,
  results,
  onClose = () => {},
}: ShareModalProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const ogpImageUrl = useMemo(() => {
    return `${OGP_URL}${results ? `?results=${results}` : ''}`;
  }, [results]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const url = new URL(window.location.href);
    url.searchParams.set('results', results);
    return url.toString();
  }, [results]);

  const handleClickOverlay = () => {
    onClose?.();
  };

  const handleClickBody = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const onClickClose = () => {
    onClose?.();
  };

  const onLoadOgpImage = () => {
    setIsLoaded(true);
  };

  const onClickCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('URLをコピーしました');
  };

  return (
    <div
      className={`${styles.container} ${isOpen ? styles.open : ''}`}
      onClick={handleClickOverlay}
    >
      <div
        className={styles.body}
        onClick={handleClickBody}
      >
        <div className={styles.header}>
          <h3>ガチャ結果をシェア</h3>
          <button className={styles.close_button} onClick={onClickClose}>×</button>
        </div>
        <div className={styles.ogp_image_container}>
          <img
            src={ogpImageUrl}
            alt=""
            width={600}
            height={315}
            onLoad={onLoadOgpImage}
          />
          {!isLoaded && (
            <div className={styles.ogp_image_loading}>
              <p>読み込み中</p>
            </div>
          )}
        </div>

        <div className={styles.ogp_image_url_container}>
          <input type="text" value={shareUrl} readOnly className={styles.ogp_image_url} />
          <button
            type="button"
            className={styles.ogp_image_url_copy_button}
            onClick={onClickCopy}
          >コピー</button>
        </div>
      </div>
    </div>
  );
}

export const useShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ModalComponent = ({ results }: { results: string }) => {
    return (
      <ShareModal
        isOpen={isOpen}
        results={results}
        onClose={() => setIsOpen(false)}
      />
    );
  };

  return {
    isOpen,
    setIsOpen,
    ShareModal: ModalComponent,
  };
}
