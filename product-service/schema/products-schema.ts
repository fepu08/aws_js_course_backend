import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.number().int(),
  count: z.number().int(),
});

export const BasicProductSchema = CreateProductSchema.omit({
  count: true,
}).extend({
  id: z.string(),
});

export const StockSchema = z.object({
  product_id: z.string(),
  count: z.number().int(),
});

// TODO fix this
export const ProductsStocksSchema = z.array(
  z.object({
    Put: z.object({
      TableName: z.string(),
      Item: BasicProductSchema,
    }),
  }),
  z.object({
    Put: z.object({
      TableName: z.string(),
      Item: StockSchema,
    }),
  })
);