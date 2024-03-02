import { useEffect, useState } from 'react';
import { uid } from 'react-uid';
import handleRequest from '../../utils/api';

import {
	auth,
	getProgress,
	removeDuplcates,
	removeDuplcatesById,
	sort,
} from '../../utils/helpers';
import styles from './Shop.module.css';
import {
	IProduct,
	IStatusBrands,
	IStatusIds,
	IStatusPrices,
	IStatusProduct,
} from '../../utils/types';
import Card from '../../components/card/Card';
import LoaderSeach from '../../ui/loader-seach/LoaderSeach';
import Loader from '../../ui/loader/Loader';
import { actions, fields } from '../../utils/constants';
import Filters from '../../components/filters/Filters';
import ButtonNav from '../../ui/button-nav/ButtonNav';
import OverLay from '../../components/overlay/Overlay';

export default function Shop() {
	const [isSearching, setIsSearching] = useState(false);
	const [scroll, setScroll] = useState(0);
	const [itemsAllToShow, setItemsAllToShow] = useState<IProduct[]>([]);
	const [itemsFilteredToShow, setItemsFilteredToShow] = useState<IProduct[]>(
		[]
	);
	const [itemsAllUniqueIds, setItemsAllUniqueIds] = useState({
		itemsId: [] as string[],
		itemsQty: 0,
	});

	const [itemsAllIds, setItemsAllIds] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as string[],
	});

	const [itemsFetchedAll, setItemsFetchedAll] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as IProduct[],
	});

	const [itemsFetchedFiltered, setItemsFetchedFiltered] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as IProduct[],
	});

	const [filteredIds, setFilteredIds] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as string[],
	});

	const [brands, setBrands] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as string[] | null[],
	});

	const [prices, setPrices] = useState<
		IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct
	>({
		isLoading: false,
		data: [] as number[],
	});

	const [limitItemsAllToFetch, setLimitItemsAllToFetch] = useState(100);
	const [offsetItemsAllToFetch, setOffsetItemsAllToFetch] = useState(0);

	const [limitItemsFilteredToFetch, setLimitItemsFilteredToFetch] =
		useState(100);
	const [offsetItemsFilteredToFetch, setOffsetItemsFilteredToFetch] =
		useState(0);

	const [limitItemsAllToShow, setLimitItemsAllToShow] = useState(50);
	const [offsetItemsAllToShow, setOffsetItemsAllToShow] = useState(0);

	const [limitItemsFilteredToShow, setLimitItemsFilteredToShow] = useState(50);
	const [offsetItemsFilteredToShow, setOffsetItemsFilteredToShow] = useState(0);

	const [progress, setProgress] = useState(0);

	const [password] = useState(auth());

	// Получаем id всех товаров, все брэнды и цены
	useEffect(() => {
		handleRequest(brands, setBrands, password, {
			action: actions.GET_FIELDS,
			params: { field: fields.BRAND },
		});
		handleRequest(prices, setPrices, password, {
			action: actions.GET_FIELDS,
			params: { field: fields.PRICE },
		});
		handleRequest(itemsAllIds, setItemsAllIds, password, {
			action: actions.GET_IDS,
		});
	}, []);

	// Удаляем дубликаты всех id
	useEffect(() => {
		if (itemsAllIds.data.length > 0) {
			setItemsAllUniqueIds({
				itemsId: removeDuplcates(itemsAllIds.data as string[]),
				itemsQty: itemsAllIds.data.length,
			});
		}
	}, [itemsAllIds.data.length]);

	// Удаляем дубликаты цен для выпадающего списка в фильрах поиска
	// и сортирем цены по возрастанию
	useEffect(() => {
		setPrices((prev) => {
			return { ...prev, data: removeDuplcates(sort(prices.data as number[])) };
		});
	}, [prices.data.length]);

	// Удаляем дубликаты брэндов для выпадающего списка в фильрах поиска
	useEffect(() => {
		setBrands((prev) => {
			return {
				...prev,
				data: removeDuplcates(brands.data as number[] | null[]),
			};
		});
	}, [brands.data.length]);

	// Получаем 100 неотфильтрованных товаров по id
	useEffect(() => {
		if (itemsAllUniqueIds.itemsQty > 0) {
			handleRequest(itemsFetchedAll, setItemsFetchedAll, password, {
				action: actions.GET_ITEMS,
				params: {
					ids: itemsAllUniqueIds.itemsId.slice(
						offsetItemsAllToFetch,
						limitItemsAllToFetch
					),
				},
			});
		}
	}, [itemsAllUniqueIds.itemsQty, offsetItemsAllToFetch]);

	// Отбираем 50 товаров для показа, удаляем дубликаты
	useEffect(() => {
		if (itemsFetchedAll.data.length > 0) {
			const uniqueItems = removeDuplcatesById(
				itemsFetchedAll.data as IProduct[]
			);
			setItemsAllToShow(
				uniqueItems.slice(offsetItemsAllToShow, limitItemsAllToShow)
			);
		}
	}, [itemsFetchedAll.data.length, offsetItemsAllToShow, limitItemsAllToShow]);

	// Отбираем 50 отфильтрованных товаров для показа, удаляем дубликаты
	useEffect(() => {
		const uniqueItems = removeDuplcatesById(
			itemsFetchedFiltered.data as IProduct[]
		);
		setItemsFilteredToShow(
			uniqueItems.slice(offsetItemsFilteredToShow, limitItemsFilteredToShow)
		);
	}, [
		itemsFetchedFiltered.data.length,
		offsetItemsFilteredToShow,
		limitItemsFilteredToShow,
	]);

	// Отоброжение просмотренных товаров в процентах
	useEffect(() => {
		if (filteredIds.data.length > 0) {
			setProgress(
				getProgress(
					removeDuplcates(filteredIds.data as string[]).length,
					limitItemsFilteredToShow
				)
			);
		} else
			setProgress(
				getProgress(itemsAllUniqueIds.itemsId.length, limitItemsAllToShow)
			);
	}, [
		itemsAllUniqueIds.itemsId.length,
		limitItemsAllToShow,
		limitItemsFilteredToShow,
		filteredIds.data,
	]);

	const scrollTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const handleScroll = () => {
			setScroll(window.scrollY);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	if (
		itemsAllIds.isLoading ||
		(itemsFetchedAll.isLoading && offsetItemsAllToShow === 0)
	) {
		return <Loader />;
	}

	return (
		<>
			<Filters
				filteredIds={filteredIds as IStatusIds}
				setFilteredIds={setFilteredIds}
				itemsFetchedFiltered={itemsFetchedFiltered as IStatusProduct}
				setItemsFetchedFiltered={setItemsFetchedFiltered}
				password={password}
				setIsSearching={setIsSearching}
				prices={prices.data as number[]}
				brands={brands.data as (string | null)[]}
				setLimitItemsAllToShow={setLimitItemsAllToShow}
				offsetItemsAllToShow={offsetItemsAllToShow}
				setOffsetItemsAllToShow={setOffsetItemsAllToShow}
				setLimitItemsAllToFetch={setLimitItemsAllToFetch}
				offsetItemsAllToFetch={offsetItemsAllToFetch}
				setOffsetItemsAllToFetch={setOffsetItemsAllToFetch}
				setLimitItemsFilteredToShow={setLimitItemsFilteredToShow}
				offsetItemsFilteredToShow={offsetItemsFilteredToShow}
				setOffsetItemsFilteredToShow={setOffsetItemsFilteredToShow}
				progress={progress}
				limitItemsFilteredToFetch={limitItemsFilteredToFetch}
				setLimitItemsFilteredToFetch={setLimitItemsFilteredToFetch}
				offsetItemsFilteredToFetch={offsetItemsFilteredToFetch}
				setOffsetItemsFilteredToFetch={setOffsetItemsFilteredToFetch}
				itemsFetchedAllIsloading={itemsFetchedAll.isLoading}
			/>

			<div className={styles.products}>
				{!isSearching &&
					itemsAllToShow.map((item) => {
						return <Card {...item} key={uid(item)} />;
					})}
				{isSearching &&
					itemsFilteredToShow.length > 0 &&
					itemsFilteredToShow.map((item) => {
						return <Card {...item} key={uid(item)} />;
					})}
				{scroll > document.documentElement.clientHeight && (
					<ButtonNav onClick={scrollTop} />
				)}
			</div>

			{(filteredIds.isLoading ||
				(itemsFetchedFiltered.isLoading &&
					offsetItemsFilteredToShow === 0)) && (
				<OverLay>
					<LoaderSeach />
				</OverLay>
			)}
		</>
	);
}
