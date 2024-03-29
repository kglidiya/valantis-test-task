/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { fields } from '../../utils/constants';
import styles from './Tabs.module.css';

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
		<ul className={styles.list}>
			<li
				onClick={handleTab1}
				className={
					activeTab === fields.PRODUCT
						? `${styles.list__item} ${styles.list__item_active}`
						: styles.list__item
				}
			>
				Поиск по товару
			</li>
			<li
				onClick={handleTab2}
				className={
					activeTab === fields.BRAND
						? `${styles.list__item} ${styles.list__item_active}`
						: styles.list__item
				}
			>
				Поиск по брэнду
			</li>
			<li
				onClick={handleTab3}
				className={
					activeTab === fields.PRICE
						? `${styles.list__item} ${styles.list__item_active}`
						: styles.list__item
				}
			>
				Поиск по цене
			</li>
		</ul>
	);
}
