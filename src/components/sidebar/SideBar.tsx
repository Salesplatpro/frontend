import React, {useState} from 'react';
import logo from '../../assets/logo.png';
import styles from './sidebar.module.scss';
import { sidebarData } from "./sidebarData";
import employer from '../../assets/employer.png';
import { IoIosArrowDown } from "react-icons/io";
import { SidebarList } from "../lists";

export const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className={styles.sideBarContainer}>
      <div>
        <div className={styles.imageContainer}>
          <img src={logo} className={styles.logo} />
        </div>
        <div className={styles.sidebarList}>
          {sidebarData.map((data, index) => (
            <SidebarList
              key={index}
              icon={data.icon}
              name={data.name}
              count={data.count}
              link={data.link}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          )) }
        </div>
      </div>
      <div className={styles.employer}>
        <div className={styles.employerDetails}>
          <img src={employer} />
          <div>
            <div className={styles.employerName}>Yolex Tech</div>
            <div className={styles.employerType}>Employer</div>
          </div>
        </div>
        <IoIosArrowDown size={20} />
      </div>
    </div>
  );
};
