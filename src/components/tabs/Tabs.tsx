import { fields } from "../../utils/constants";
import styles from "./Tabs.module.css";

interface ITabsProps {
  handleTab1: VoidFunction;
  handleTab2: VoidFunction;
  handleTab3: VoidFunction;
  activeTab: string;
}

export default function Tabs({
  handleTab1,
  handleTab2,
  handleTab3,
  activeTab,
}: ITabsProps) {
  return (
    <ul className={styles.tabs}>
      <li
        onClick={handleTab1}
        className={
          activeTab === fields.PRODUCT
            ? `${styles.tab} ${styles.tab_active}`
            : styles.tab
        }
      >
        Поиск по названию товара
      </li>
      <li
        onClick={handleTab2}
        className={
          activeTab === fields.BRAND
            ? `${styles.tab} ${styles.tab_active}`
            : styles.tab
        }
      >
        Поиск по брэнду
      </li>
      <li
        onClick={handleTab3}
        className={
          activeTab === fields.PRICE
            ? `${styles.tab} ${styles.tab_active}`
            : styles.tab
        }
      >
        Поиск по цене
      </li>
    </ul>
  );
}
