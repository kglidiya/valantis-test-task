import styles from "./Input.module.css";
import CloseIcon from "../icons/closeIcon/CloseIcon";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ChangeEventHandler } from "react";
import { IFieldVales } from "../../utils/types";

interface IInput {

  placeholder: string;
  name: "brand" | "product" | "price";
  register: UseFormRegister<IFieldVales>;
 
  setValue: UseFormSetValue<IFieldVales>
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const Input = ({

  placeholder,
  name,
  register,

  setValue,
  onChange,
}: IInput) => {
  return (
    <div className={styles.container}>
     <CloseIcon onClick={() => setValue(name, "")} />

      <input
      
        placeholder={placeholder}
        type="text"
        autoComplete="off"
        {...register(name, {
          onChange,
        })}
        className={styles.input}
      />
    </div>
  );
};

export default Input;
