import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

import { ErrorResponse } from '@models/api.types';
import { StatusCodes } from 'http-status-codes';
import {
  BASIC_ERROR_MESSAGE,
  GET_PRODUCT_BY_ID_ERROR_MESSAGE,
  getMissingProductIdErrorMessage,
} from 'models/messages';
import { ProductService } from '@services/productService';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const productsService = new ProductService();
  try {
    console.log(
      'Lambda function getProductById request',
      JSON.stringify(event)
    );

    const productId = event.pathParameters?.productId;

    if (!productId) {
      const errorResPonse: ErrorResponse = {
        message: GET_PRODUCT_BY_ID_ERROR_MESSAGE,
      };

      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResPonse),
      };
    }

    const product = productsService.getProductById(productId);

    if (!product) {
      const errorResPonse: ErrorResponse = {
        message: getMissingProductIdErrorMessage(productId),
      };

      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResPonse),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
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