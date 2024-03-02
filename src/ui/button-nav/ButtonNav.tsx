import styles from './ButtonNav.module.css';
import ArrowUp from '../icons/arrow-up/ArrowUp';

interface IButton {
	onClick?: () => void;
}
export default function ButtonNav({ onClick }: IButton) {
	return (
		<button
			type="button"
			aria-label="button"
			className={styles.button}
			onClick={onClick}
		>
			<ArrowUp />
		</button>
	);
}
