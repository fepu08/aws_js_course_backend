import { mockProducts } from './products.mock';

export const mockStocks = mockProducts.map((product, index) => ({
  product_id: product.id,
  count: (min = 0, max = 62) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}));