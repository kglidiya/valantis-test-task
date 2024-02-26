import { fields } from "../../utils/constants";
import styles from "./Tabs.module.css";

export default function Tabs({
  handleTab1,
  handleTab2,
  handleTab3,
  activeTab
}: {
  handleTab1: any;
  handleTab2: any;
  handleTab3: any;
  activeTab: string
}) {
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
