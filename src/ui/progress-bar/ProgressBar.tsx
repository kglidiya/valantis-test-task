import styles from './ProgressBar.module.css';

export default function ProgressBar({ progress }: { progress: number }) {
	return (
		<div className={styles.wrapper}>
			<div className={styles.progress} style={{ width: `${progress}%` }} />
		</div>
	);
}
