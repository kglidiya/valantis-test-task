export interface IProduct {
	brand: string | null;
	id: string;
	price: number;
	product: string;
}

export interface IFieldVales {
	brand?: string | null;
	product?: string | undefined;
	price?: number | string | undefined;
}

export interface IStatusIds {
	isLoading: boolean;
	data: string[];
}

export interface IStatusProduct {
	isLoading: boolean;
	data: IProduct[];
}

export interface IStatusPrices {
	isLoading: boolean;
	data: number[];
}

export interface IStatusBrands {
	isLoading: boolean;
	data: string[] | null[];
}
