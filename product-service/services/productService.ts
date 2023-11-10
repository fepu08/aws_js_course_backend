import {
  BasicProduct,
  CreateProductProps,
  Product,
  Stock,
} from '@models/product.types';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docDbClient } from './dbUtils';
import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { v4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

    const scanProducts = new ScanCommand({ TableName: PRODUCTS_TABLE });
    const scanStocks = new ScanCommand({ TableName: STOCKS_TABLE });

    const [basicProducts, stocks] = await Promise.all([
      docDbClient
        .send(scanProducts)
        .then((res) => res.Items as unknown as BasicProduct[]),
      docDbClient
        .send(scanStocks)
        .then((res) => res.Items as unknown as Stock[]),
    ]);

    return basicProducts?.map((basicProduct) => ({
      ...basicProduct,
      count:
        stocks?.find((stock) => stock.product_id === basicProduct.id)?.count ??
        0,
    }));
  }

  async getProductById(productId: string): Promise<Product | null> {
    const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;

    const productQuery = new GetCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
    });

    const stockQuery = new GetCommand({
      TableName: STOCKS_TABLE,
      Key: { product_id: productId },
    });

    const [basicProduct, stock] = await Promise.all([
      docDbClient.send(productQuery).then((res) => res.Item as BasicProduct),
      docDbClient.send(stockQuery).then((res) => res.Item as Stock),
    ]);

    if (!basicProduct) {
      return null;
    }

    return {
      ...basicProduct,
      count: stock?.count ?? 0,
    };
  }

  async createProduct({
    count,
    description,
    price,
    title,
  }: CreateProductProps): Promise<string | null> {
    const { PRODUCTS_TABLE = '', STOCKS_TABLE = '' } = process.env;

    const productId = v4();

    const command = new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: PRODUCTS_TABLE,
            Item: marshall({
              id: productId,
              description,
              title,
              price,
            }),
          },
        },
        {
          Put: {
            TableName: STOCKS_TABLE,
            Item: marshall({
              product_id: productId,
              count,
            }),
          },
        },
      ],
    });

    const transactionResponse = await docDbClient.send(command);

    if (transactionResponse.$metadata.httpStatusCode !== StatusCodes.OK) {
      return null;
    }

    return productId;
  }
}