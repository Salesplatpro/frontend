import React, { useState, useEffect } from 'react';
import imageOne from '../../assets/bgImage1.png';
import imageTwo from '../../assets/bgImage2.png';
import imageThree from '../../assets/bgImage3.png';
import styles from './Carousel.module.scss';
import { BsStars } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";

const descriptions = [
  {
    description: 'Genius is the gold in the mine; talent is the miner that works and brings it out.',
    author: '— Lady Marguerite Blessington',
    image: imageOne
  },
  {
    description: '“Hard work pays off – hard work beats talent any day, but if you’re talented and work hard, it’s hard to be beat.”',
    author: '—Robert Griffin III',
    image: imageTwo
  },
  {
    description: '“Everyone has talent. What is rare is the courage to follow the talent to the dark place where it leads.”',
    author: '— Erica Jong',
    image: imageThree
  }
];

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const color =' #ff5757';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % descriptions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {descriptions.map((item, index) => (
        <div
          key={index}
          className={styles.imageContainer}
          style={{ display: index === currentIndex ? 'block' : 'none' }}
        >
          <img src={item.image} alt={`Slide ${index + 1}`} className={styles.image} />
          <div className={styles.imageContainerOverlay}></div> {/* Add overlay if needed */}
        </div>
      ))}
      <div className={styles.text}>
        <BsStars size={64} color="white" />
        <div className={styles.description}>
          {descriptions[currentIndex].description}
        </div>
        <div className={styles.footer}>
          <div className={styles.author}>{descriptions[currentIndex].author}</div>
          <div className={styles.dots}>
            {Array(descriptions.length).fill(null).map((_, index) => (
              <GoDotFill key={index} color={currentIndex === index ? color : 'white'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
