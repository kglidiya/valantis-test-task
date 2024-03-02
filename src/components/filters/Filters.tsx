import {
	ChangeEventHandler,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import {
	IFieldVales,
	IStatusBrands,
	IStatusIds,
	IStatusPrices,
	IStatusProduct,
} from '../../utils/types';
import handleRequest from '../../utils/api';
import { actions, fields } from '../../utils/constants';
import useDebounce from '../../hooks/useDebounce';
import InputSelect from '../../ui/inputSelect/InputSelect';
import Tabs from '../tabs/Tabs';
import styles from './Filters.module.css';
import Input from '../../ui/input/Input';
import Arrow from '../../ui/icons/arrow/Arrow';
import ProgressBarr from '../../ui/progress-bar/ProgressBar';

const rotate =
	'translate(8.500000, 8.500000) scale(-1, 1) translate(-8.500000, -8.500000)';

interface IFiltersProps {
	prices: number[];
	brands: (string | null)[];
	password: string;
	setIsSearching: Dispatch<SetStateAction<boolean>>;
	progress: number;
	filteredIds: IStatusIds;
	setFilteredIds: Dispatch<
		SetStateAction<IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct>
	>;
	itemsFetchedFiltered: IStatusProduct;
	setItemsFetchedFiltered: Dispatch<
		SetStateAction<IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct>
	>;
	setLimitItemsAllToShow: Dispatch<SetStateAction<number>>;
	setLimitItemsFilteredToShow: Dispatch<SetStateAction<number>>;
	offsetItemsAllToShow: number;
	setOffsetItemsAllToShow: Dispatch<SetStateAction<number>>;
	setOffsetItemsAllToFetch: Dispatch<SetStateAction<number>>;
	setLimitItemsAllToFetch: Dispatch<SetStateAction<number>>;
	limitItemsFilteredToFetch: number;
	setLimitItemsFilteredToFetch: Dispatch<SetStateAction<number>>;
	offsetItemsFilteredToShow: number;
	setOffsetItemsFilteredToShow: Dispatch<SetStateAction<number>>;
	offsetItemsFilteredToFetch: number;
	setOffsetItemsFilteredToFetch: Dispatch<SetStateAction<number>>;
}

export default function Filters({
	prices,
	brands,
	password,
	progress,
	setIsSearching,
	filteredIds,
	setFilteredIds,
	itemsFetchedFiltered,
	setItemsFetchedFiltered,
	setLimitItemsAllToShow,
	setOffsetItemsAllToShow,
	offsetItemsAllToShow,
	setOffsetItemsAllToFetch,
	setLimitItemsAllToFetch,
	limitItemsFilteredToFetch,
	setLimitItemsFilteredToFetch,
	setLimitItemsFilteredToShow,
	offsetItemsFilteredToShow,
	setOffsetItemsFilteredToShow,
	offsetItemsFilteredToFetch,
	setOffsetItemsFilteredToFetch,
}: IFiltersProps) {
	const [activeTab, setActiveTab] = useState(fields.PRODUCT);
	const [isBtnPrevDisabled, setIsBtnPrevDisabled] = useState(true);
	const [isBtnNextDisabled, setIsBtnNextDisabled] = useState(false);

	const { register, watch, setValue, reset } = useForm<IFieldVales>({
		values: {
			brand: null,
			product: '',
			price: '',
		},
	});
	const scrollTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
		});
	};
	const getNextItems = () => {
		// Ограничиваем offset и limit значениямием, не превышающим общее кол-ва товаров.
		// Если есть отфильтрованные товары, меняем offset и limit для них,
		// если отфильтрованных товаров нет, значит поиск не дал
		// результата и, соотвествено, offset и limit увеличивается для всех товаров
		if (progress < 100) {
			scrollTop();
			if (itemsFetchedFiltered.data.length > 0) {
				setOffsetItemsFilteredToFetch((prev) => prev + 100);
				setLimitItemsFilteredToFetch((prev) => prev + 100);
				setLimitItemsFilteredToShow((prev) => prev + 50);
				setOffsetItemsFilteredToShow((prev) => prev + 50);
			} else {
				setLimitItemsAllToFetch((prev) => prev + 100);
				setOffsetItemsAllToFetch((prev) => prev + 100);
				setOffsetItemsAllToShow((prev) => prev + 50);
				setLimitItemsAllToShow((prev) => prev + 50);
			}
		}
	};

	const getPrevItems = () => {
		// Ограничиваем offset и limit значением свыше 0. Если есть отфильтрованные товары,
		// меняем offset и limit для них, если отфильтрованных товаров нет, значит поиск не дал
		// результата и, соотвествено, offset и limit уменьшается для всех товаров
		if (
			itemsFetchedFiltered.data.length > 0 &&
			offsetItemsFilteredToShow !== 0
		) {
			setLimitItemsFilteredToShow((prev) => prev - 50);
			setOffsetItemsFilteredToShow((prev) => prev - 50);
		}
		if (itemsFetchedFiltered.data.length === 0 && offsetItemsAllToShow !== 0) {
			setOffsetItemsAllToShow((prev) => prev - 50);
			setLimitItemsAllToShow((prev) => prev - 50);
		}
	};

	// Disabling кнопок
	useEffect(() => {
		if (offsetItemsAllToShow === 0 && offsetItemsFilteredToShow === 0) {
			setIsBtnPrevDisabled(true);
		} else setIsBtnPrevDisabled(false);
		if (progress === 100) {
			setIsBtnNextDisabled(true);
		} else setIsBtnNextDisabled(false);
	}, [offsetItemsFilteredToShow, progress, offsetItemsAllToShow]);

	// Получение id отфильтрованных товаров
	const filterItems = (values: IFieldVales) => {
		setIsSearching(true);
		const params = {} as IFieldVales;

		if (values.brand) {
			params.brand = values.brand;
		}

		if (values.product && values.product?.length >= 4) {
			params.product = values.product;
		}
		if (values.price) {
			params.price = values.price;
		}

		if (Object.keys(params).length !== 0) {
			handleRequest(filteredIds, setFilteredIds, password, {
				action: actions.FILTER,
				params,
			});
		}
	};

	useEffect(() => {
		const subscription = watch((values) => {
			// Сброс параметров фильрации при изменении значений инпутов
			setItemsFetchedFiltered((prev) => {
				return { ...prev, data: [] };
			});
			setFilteredIds((prev) => {
				return { ...prev, data: [] };
			});

			setOffsetItemsFilteredToFetch(0);
			setLimitItemsFilteredToFetch(100);
			setOffsetItemsFilteredToShow(0);
			setLimitItemsFilteredToShow(50);
			setIsSearching(false);

			// Инициализация поиска при выборе значений выпаающего списка
			if (values.price || values.brand || values.brand !== null) {
				filterItems(values);
			}
		});

		return () => subscription.unsubscribe();
	}, [watch]);

	// Отложенный поиск при вводе значений в инпут 'product'
	const debouncedSearch = useDebounce(filterItems, 2000);

	const handleInputProductChange: ChangeEventHandler<HTMLInputElement> = (
		e
	) => {
		if (e.target.value.length < 4) {
			setIsSearching(false);
		} else {
			debouncedSearch(watch());
		}
	};

	// Поиск отфильтрованных товаров по id
	useEffect(() => {
		if (filteredIds.data.length > 0) {
			handleRequest(itemsFetchedFiltered, setItemsFetchedFiltered, password, {
				action: actions.GET_ITEMS,
				params: {
					ids: filteredIds.data.slice(
						offsetItemsFilteredToFetch,
						limitItemsFilteredToFetch
					),
				},
			});
		}
	}, [filteredIds.data.length, limitItemsFilteredToFetch]);

	const handleTab1 = () => {
		setActiveTab(fields.PRODUCT);
		reset();
	};

	const handleTab2 = () => {
		setActiveTab(fields.BRAND);
		reset();
	};

	const handleTab3 = () => {
		setActiveTab(fields.PRICE);
		reset();
	};

	return (
		<div className={styles.outerWrapper}>
			<div className={styles.innerWrapper}>
				<Tabs
					activeTab={activeTab}
					handleTab1={handleTab1}
					handleTab2={handleTab2}
					handleTab3={handleTab3}
				/>
				{activeTab === fields.PRODUCT && (
					<Input
						name="product"
						placeholder="Тип товара"
						register={register}
						onChange={handleInputProductChange}
						setValue={setValue}
					/>
				)}
				{activeTab === fields.BRAND && (
					<InputSelect
						placeholder="Брэнд"
						register={register}
						setValue={setValue}
						options={brands}
						name="brand"
					/>
				)}
				{activeTab === fields.PRICE && (
					<InputSelect
						placeholder="Цена"
						register={register}
						setValue={setValue}
						options={prices}
						name="price"
					/>
				)}

				<div className={styles.navigation}>
					<span onClick={getPrevItems}>
						<Arrow rotate={rotate} disabled={isBtnPrevDisabled} />
					</span>
					<ProgressBarr progress={progress} />
					<span onClick={getNextItems}>
						<Arrow disabled={isBtnNextDisabled} />
					</span>
				</div>
			</div>
		</div>
	);
}
