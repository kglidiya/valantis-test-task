import styles from './CloseIcone.module.css';

export default function CloseIcon({ onClick }: { onClick: VoidFunction }) {
	return (
		<div className={styles.icon} onClick={onClick}>
			<svg
				width="32px"
				height="32px"
				viewBox="0 0 64 64"
				fill="none"
				stroke="#000000"
			>
				<line x1="16" y1="16" x2="48" y2="48" />
				<line x1="48" y1="16" x2="16" y2="48" />
			</svg>
		</div>
	);
}
