import React, {useState} from 'react';
import logo from '../../assets/logo.png';
import styles from './sidebar.module.scss';
import { sidebarData } from "./sidebarDummyData";
import { SidebarList } from "../list";
import employer from '../../assets/employer.png';
import { IoIosArrowDown } from "react-icons/io";
import {useNavigate} from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleSidebarListClick = (index: number, path: string | undefined) => {
    setActiveIndex(index);
    navigate(path);
  };

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
              active={activeIndex === index}
              onClick={() => {
                setActiveIndex(index),
                handleSidebarListClick(index, data.path)
              }}
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
