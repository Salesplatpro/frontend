import React from 'react';
import styles from "./countBadge.module.scss";

export const CountBadge = ({ item }: { item: number | undefined }) => {
  return (
    <>
      {item && <div className={styles.countBadge}>
        <div>{item}</div>
      </div>}
    </>
  );
}
