import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

import { mockProducts } from '@mocks/products.mock';
import { Product } from 'models/product.types';
import { ErrorResponse } from 'models/api.types';
import { StatusCodes } from 'http-status-codes';

const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const productId = event.pathParameters?.productId;
    const requestedProduct = mockProducts.find(
      (product) => product.id === productId
    );

    if (!requestedProduct) {
      const errorResponse: ErrorResponse = {
        message: `Product with id:${productId} not found.`,
      };

      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResponse),
      };
    }

    const product: Product = await Promise.resolve(requestedProduct);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error: unknown) {
    let message = 'Something went wrong.';

    if (error instanceof Error) {
      message = error.message;
    }

    const errorResponse: ErrorResponse = { message };
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify(errorResponse),
    };
  }
};
export default handler;
