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

// export interface IItem {
//   brand: null | string;
//   id: string;
//   price: number;
//   product: string;
// }

export interface IStatusIds {
  isLoading: boolean;
  data: string[];
  error: string;
}

export interface IStatusProduct {
  isLoading: boolean;
  data: IProduct[];
  error: string;
}