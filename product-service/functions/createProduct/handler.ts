import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { docDbClient } from '@services/dbUtils';
import { CreateProductSchema } from '@schema/products-schema';
import { v4 } from 'uuid';
import { CreateProduct } from '@models/product.types';
import { ErrorResponse } from '@models/api.types';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    console.log('Lambda function createProduct request', JSON.stringify(event));

    const { PRODUCTS_TABLE = '', STOCKS_TABLE = '' } = process.env;

    const parsedBody = JSON.parse(event.body || '{}');

    const validationResult = CreateProductSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        message: 'Product data is invalid',
      };

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify(errorResponse),
      };
    }

    const { count, description, price, title }: CreateProduct =
      validationResult.data;

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

    await docDbClient.send(command);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify({
        message: 'Product created successfully',
        productId,
      }),
    };
  } catch (error: unknown) {
    let message = 'An error occurred while creating the product';

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