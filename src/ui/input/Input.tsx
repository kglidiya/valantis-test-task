import styles from "./Input.module.css";
import CloseIcon from "../icons/closeIcon/CloseIcon";

interface IInput {
  type: string;
  placeholder?: string;
  name: string;
  register: any;
  clearButton?: boolean;
  setValue?: any;
  onChange?: any;
}
const Input = ({
  type,
  placeholder,
  name,
  register,
  clearButton,
  setValue,
  onChange,
}: IInput) => {
  return (
    <div className={styles.container}>
      {clearButton && <CloseIcon onClick={() => setValue(name, "")} />}

      <input
        placeholder={placeholder}
        type={type}
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
