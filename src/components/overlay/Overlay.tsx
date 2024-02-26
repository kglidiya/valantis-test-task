import { ReactNode } from "react";
import styles from "./OverLay.module.css";

interface IModalOverLayProps {
  children: ReactNode;
}

export default function OverLay({ children }: IModalOverLayProps) {
  return <div className={`${styles.overlay} `}>{children}</div>;
}
