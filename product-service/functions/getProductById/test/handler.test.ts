import { mockProducts } from '@mocks/products.mock';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWSMockLambdaContext from 'aws-lambda-mock-context';
import { StatusCodes } from 'http-status-codes';

import { getProductById } from 'functions';

describe('Test getProductById lambda function', () => {
  test('Successfully returns product by id', async () => {
    const event = {
      pathParameters: {
        productId: mockProducts[0].id,
      } as unknown,
    } as APIGatewayProxyEvent;

    const result = (await getProductById(
      event,
      AWSMockLambdaContext(),
      () => {}
    )) as APIGatewayProxyResult;

    const parsedResult = JSON.parse(result.body);

    expect(parsedResult).toBeDefined();
    expect(result.statusCode).toEqual(StatusCodes.OK);
  });

  test('Fails to get unknown product by id', async () => {
    const event = {
      pathParameters: {
        productId: 'test-0123',
      } as unknown,
    } as APIGatewayProxyEvent;

    const result = (await getProductById(
      event,
      AWSMockLambdaContext(),
      () => {}
    )) as APIGatewayProxyResult;

    const parsedResult = JSON.parse(result.body);

    expect(parsedResult?.message).toBeDefined();
    expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
  });
});
