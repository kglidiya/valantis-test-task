import { useState } from "react";
import styles from "./InputSelect.module.css";
import CloseIcon from "../icons/closeIcon/CloseIcon";

interface IInput {
  options: string[];
  type: string;
  placeholder?: string;
  name: string;

  value?: string;

  clearButton: boolean;
  register: any;
  setValue: any;
  values?: { [name: string]: string | number | string[] | null };
  onChange?: any;
}
const InputSelect = ({
  options,
  type,
  placeholder,
  name,

  clearButton,

  setValue,

  register,
  onChange,
}: IInput) => {
  const [optionsToShow, setOptionsToShow] = useState(options);
  const [isActive, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <div className={styles.container}>
      {clearButton && (
        <CloseIcon
          onClick={() => {
            setValue(name, "");
            setOptionsToShow(options)
            // setActive(false);
          }}
        />
      )}

      <input
        autoComplete="off"
        type={type}
        className={styles.input}
        placeholder={placeholder}
        {...register(name, {
          onChange: (e: any) => {
            const value = e.target.value;

            setOptionsToShow((prev) => {
              if (value === "") {
                return options;
              } else return prev.filter((el) => String(el).startsWith(value));
            });
          },
        })}
        onFocus={() => setActive(true)}
      />

      <div
        className={`${styles.wrapper} ${
          !isActive ? styles.list_default : styles.list_active
        }`}
      >
        <ul
          // className={`${styles.list} ${
          //   !isActive ? styles.list_default : styles.list_active
          // }`}
          className={`${styles.list}`}
        >
          {optionsToShow.map((option) => {
            return (
              <li
                key={option}
                onClick={() => {
                  handleToggle();
                  setValue(name, option);
                }}
                className={styles.list__item}
              >
                {option === null ? "Не иммет значения" : option}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InputSelect;
