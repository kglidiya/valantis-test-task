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
