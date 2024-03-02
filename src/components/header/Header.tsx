import { motion } from 'framer-motion';
import Diamond from '../../ui/icons/diamond/Diamond';
import styles from './Header.module.css';

export default function Header() {
	return (
		<header className={styles.wrapper}>
			<motion.div
				initial={{ x: '-20%' }}
				whileInView={{ x: 0 }}
				transition={{ duration: 0.5 }}
				className={styles.logo}
			>
				<Diamond />
				<h1 className={styles.logo__text}>Valantis</h1>
			</motion.div>
		</header>
	);
}
