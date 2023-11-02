import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { BasicProduct, Product, Stock } from '@models/product.types';
import { ErrorResponse } from '@models/api.types';
import { StatusCodes } from 'http-status-codes';
import {
  BASIC_ERROR_MESSAGE,
  GET_PRODUCT_BY_ID_ERROR_MESSAGE,
  getMissingProductIdErrorMessage,
} from '@models/messages';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docDbClient } from '@services/index';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    console.log(
      'Lambda function getProductById request',
      JSON.stringify(event)
    );

    const productId = event.pathParameters?.productId;
    console.log(`productId: ${productId}`);


    if (!productId) {
      const errorResPonse: ErrorResponse = {
        message: GET_PRODUCT_BY_ID_ERROR_MESSAGE,
      };

      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResPonse),
      };
    }

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
    console.log(`basic product: ${JSON.stringify(basicProduct)}`);
    console.log(`stock: ${JSON.stringify(stock)}`);

    if (!basicProduct) {
      const errorResPonse: ErrorResponse = {
        message: getMissingProductIdErrorMessage(productId),
      };

      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify(errorResPonse),
      };
    }

    const product: Product = Object.assign(basicProduct, {
      count: stock?.count ?? 0,
    });

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
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify(errorResponse),
    };
  }
};