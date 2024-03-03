import { memo } from 'react';
import { images } from '../../utils/constants';
import { getRandomItem } from '../../utils/helpers';
import { IProduct } from '../../utils/types';
import styles from './Card.module.css';

const Card = memo(({ brand, id, price, product }: IProduct) => {
	return (
		<article className={styles.wrapper}>
			<img
				src={getRandomItem(images)}
				alt="Фото товара"
				className={styles.image}
			/>

			<p className={styles.id}>{`Артикул: ${id}`}</p>
			<p className={styles.price}>{`${price} руб.`}</p>
			<p className={styles.product}>{product}</p>

			{product && <p className={styles.brand}>{brand}</p>}
		</article>
	);
});

export default Card;
