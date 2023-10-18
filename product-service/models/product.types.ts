import { TypeOf } from 'zod';
import {
  CreateProductSchema,
  BasicProductSchema,
  StockSchema,
  ProductsStocksSchema,
} from '@schema/index';

export type CreateProduct = TypeOf<typeof CreateProductSchema>;
export type BasicProduct = TypeOf<typeof BasicProductSchema>;
export type Stock = TypeOf<typeof StockSchema>;
export type ProductsStocks = TypeOf<typeof ProductsStocksSchema>;

export interface Product extends BasicProduct, Omit<Stock, 'product_id'> { }

export interface ProductList extends Array<Product> { }