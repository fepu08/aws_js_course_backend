import { getProducts } from '@functions';
import { mockProducts } from '@mocks/products.mock';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWSMockLambdaContext from 'aws-lambda-mock-context';

describe('Test getProducts lambda function', () => {
  test('Returns mock products', async () => {
    const event = {} as APIGatewayProxyEvent;
    const result = (await getProducts(
      event,
      AWSMockLambdaContext(),
      () => {}
    )) as APIGatewayProxyResult;

    const parsedResult = JSON.parse(result.body);
    expect(parsedResult).toStrictEqual(mockProducts);
    expect(result.statusCode).toEqual(200);
  });
});
