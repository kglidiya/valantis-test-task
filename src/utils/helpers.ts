import { Md5 } from 'ts-md5';
import { IProduct } from './types';

const getTimeStapm = () => {
	const today = new Date();
	return (
		String(today.getFullYear()) +
		String(today.getMonth() + 1).padStart(2, '0') +
		String(today.getDate()).padStart(2, '0')
	);
};

export const getProgress = (itemsAll: number, itemsShown: number) => {
	let pagesAll = 0;
	if (itemsAll % 50 === 0) {
		pagesAll = itemsAll / 50;
	} else {
		pagesAll = Math.ceil(itemsAll / 50);
	}
	const pagesShown = itemsShown / 50;
	return (pagesShown * 100) / pagesAll;
};

export const auth = () => {
	return Md5.hashStr(`${process.env.REACT_APP_PASSWORD}_${getTimeStapm()}`);
};

export const removeDuplcates = (arr: string[] | number[] | null[]) => {
	const set = new Set<string | number | null>(arr);
	return Array.from(set) as any;
};

export const removeDuplcatesById = (arr: IProduct[]) => {
	const uniqueIds = new Set();

	const unique = arr.filter((item) => {
		const isDuplicate = uniqueIds.has(item.id);
		uniqueIds.add(item.id);
		if (!isDuplicate) {
			return true;
		}
		return false;
	});
	return unique;
};

export const sort = (arr: number[]) => {
	return arr.sort((a, b) => a - b);
};

export const getRandomItem = (arr: string[]) => {
	return arr[Math.floor(Math.random() * arr.length)];
};
