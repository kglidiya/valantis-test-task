import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {
	IStatusBrands,
	IStatusIds,
	IStatusPrices,
	IStatusProduct,
} from './types';
import { BASE_URL } from './constants';

const handleRequest = async (
	status: IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct,
	setStatus: Dispatch<
		SetStateAction<IStatusIds | IStatusPrices | IStatusBrands | IStatusProduct>
	>,
	password: string,
	data?: any
) => {
	try {
		setStatus({ ...status, isLoading: true });
		axiosRetry(axios, {
			retries: 3,
			retryCondition: (error) => {
				// eslint-disable-next-line no-console
				console.log(`${error.response?.data}, message: ${error.message}`);
				return true;
			},
		});
		const res = await axios(BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth': password,
			},
			data,
		});

		if (res.status !== 200) {
			throw new Error();
		}

		setStatus({
			...status,
			isLoading: false,
			data: [...status.data, ...res.data.result],
		});
	} catch (error) {
		setStatus({
			...status,
			isLoading: false,
		});
	}
};

export default handleRequest;
