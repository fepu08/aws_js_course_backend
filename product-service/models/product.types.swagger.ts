export type Product = {
  id: string,
  title: string;
  description: string;
  price: number;
  count: number;
}

export type ProductList = Product[]

export type CreateProduct = Omit<Product, "id">