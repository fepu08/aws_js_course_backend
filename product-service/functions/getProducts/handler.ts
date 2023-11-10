import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ErrorResponse } from '@models/api.types';
import {
  BASIC_ERROR_MESSAGE,
  GET_PRODUCTS_ERROR_MESSAGE,
} from 'models/messages';
import { ProductService } from '@services/productService';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const productsService = new ProductService();
  try {
    console.log(
      'Lambda function getProductsList request',
      JSON.stringify(event)
    );

    const products = await productsService.getAllProducts();

    if (!products) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: GET_PRODUCTS_ERROR_MESSAGE,
      };
    }

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