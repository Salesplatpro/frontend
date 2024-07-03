import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import styles from './JobListing.module.scss';
import { JobListingHeaders } from "./JobListingData";

export const JobListing = () => {
  const [activeHeader, setActiveHeader] = useState(0);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.displayFlex}><IoIosArrowBack />Back</div>
        <div className={styles.createNew}>Create a new job</div>
        <div className={styles.listContainer}>
          {JobListingHeaders.map((header, index) => (
            <div
              key={index}
              className={`${styles.list} ${index === activeHeader ? styles.active : styles.notActive}`}
              onClick={() => setActiveHeader(index)}
            >
              <div className={styles.name}>{header.name}</div>
              <div className={styles.description}>{header.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
