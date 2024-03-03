import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import styles from './Input.module.css';
import CloseIcon from '../icons/closeIcon/CloseIcon';
import { IFieldVales } from '../../utils/types';

interface IInput {
	placeholder: string;
	name: 'brand' | 'product' | 'price';
	register: UseFormRegister<IFieldVales>;
	setValue: UseFormSetValue<IFieldVales>;
}
const Input = ({ placeholder, name, register, setValue }: IInput) => {
	return (
		<div className={styles.container}>
			<CloseIcon onClick={() => setValue(name, '')} />

			<input
				placeholder={placeholder}
				type="text"
				autoComplete="off"
				{...register(name)}
				className={styles.input}
			/>
		</div>
	);
};

export default Input;
