import { memo } from "react";
import { images } from "../../utils/constants";
import { getRandomItem } from "../../utils/helpers";
import { IProduct } from "../../utils/types";
import styles from "./Card.module.css";
import { motion } from 'framer-motion';


const Card = memo(({ brand, id, price, product }: IProduct) => {

  return (
    <article className={styles.wrapper}>
      <img src={getRandomItem(images)} alt="Фото товара" className={styles.image}/>
      <p className={styles.id}>{`Артикул: ${id}`}</p>
      <p className={styles.product}>{product}</p>
      <p className={styles.price}>{`${price} руб.`}</p>
      {product && <p className={styles.product}>{brand}</p>}
    </article>
  );
})

export default  Card