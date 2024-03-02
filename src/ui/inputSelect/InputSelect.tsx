/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ChangeEvent, useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import styles from './InputSelect.module.css';
import CloseIcon from '../icons/closeIcon/CloseIcon';
import { IFieldVales } from '../../utils/types';

interface IInput {
	options: (string | number | null)[];
	placeholder: string;
	name: 'brand' | 'product' | 'price';
	register: UseFormRegister<IFieldVales>;
	setValue: UseFormSetValue<IFieldVales>;
	values?: { [name: string]: string | number | string[] | null };
}
const InputSelect = ({
	options,
	placeholder,
	name,
	setValue,
	register,
}: IInput) => {
	const [optionsToShow, setOptionsToShow] = useState(options);
	const [isActive, setActive] = useState(false);

	const handleToggle = () => {
		setActive(!isActive);
	};

	return (
		<div className={styles.container}>
			<CloseIcon
				onClick={() => {
					if (name === 'brand') {
						setValue('brand', null);
					} else setValue(name, '');

					setOptionsToShow(options);
					setActive(false);
				}}
			/>

			<input
				autoComplete="off"
				type="text"
				className={styles.input}
				placeholder={placeholder}
				{...register(name, {
					onChange: (e: ChangeEvent<HTMLInputElement>) => {
						const { value } = e.target;

						setOptionsToShow((prev) => {
							if (value === '') {
								return options;
							}
							return prev.filter((el) => String(el).startsWith(value));
						});
					},
				})}
				onFocus={() => setActive(true)}
			/>
			{optionsToShow.length > 0 && (
				<div
					className={`${styles.wrapper} ${
						!isActive ? styles.wrapper_default : styles.wrapper_active
					}`}
				>
					<ul className={`${styles.list}`}>
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
									{option === null ? 'Не иммет значения' : option}
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
};

export default InputSelect;
