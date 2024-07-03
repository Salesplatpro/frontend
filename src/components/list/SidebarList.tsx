import React, {ReactNode} from 'react';
import styles from './SidebarList.module.scss';
import { CountBadge } from "../Badges";

type SidebarListProps = {
  icon: ReactNode;
  name: string;
  details?: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

export const SidebarList = ({ icon, name, details, count, active, onClick}: SidebarListProps) => {
  return (
    <div className={`${styles.listContainer} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.listItem}>
        <div>{icon}</div>
        <div>
          <div>{name}</div>
          <div>{details}</div>
        </div>
      </div>
      <CountBadge item={count} />
    </div>
  )
}
