import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { StatusCodes } from 'http-status-codes';
import { docDbClient } from '@services/index';
import { ErrorResponse } from '@models/api.types';
import { Product, BasicProduct, Stock } from '@models/product.types';
import { BASIC_ERROR_MESSAGE } from '@models/messages';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    console.log(
      'Lambda function getProductsList request',
      JSON.stringify(event)
    );

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

    console.debug(basicProducts, stocks);

    const products: Product[] = basicProducts?.map((basicProduct) => ({
      ...basicProduct,
      count:
        stocks?.find((stock) => stock.product_id === basicProduct.id)?.count ??
        0,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error: unknown) {
    let message = BASIC_ERROR_MESSAGE;

    if (error instanceof Error) {
      message = error.message;
    }
    const errorResponse: ErrorResponse = { message };

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(errorResponse),
    };
  }
};