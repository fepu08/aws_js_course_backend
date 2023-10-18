import { APIGatewayProxyHandler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { mockProducts } from '@mocks/products.mock';
import { ErrorResponse } from 'models/api.types';
import { ProductList } from 'models/product.types';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const products: ProductList = mockProducts;

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error: unknown) {
    let message = 'Something went wrong.';

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
export default handler;
