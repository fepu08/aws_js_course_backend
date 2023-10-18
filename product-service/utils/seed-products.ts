import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { mockProducts } from '../mocks/products.mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const { PRODUCTS_TABLE = '', REGION } = process.env;

const dbClient = new DynamoDBClient({
  region: REGION,
});

const docDbClient = DynamoDBDocumentClient.from(dbClient);

const addProductsToDynamoDB = async () => {
  try {
    const putRequests = mockProducts.map((product) => ({
      PutRequest: {
        Item: product,
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [PRODUCTS_TABLE]: putRequests,
      },
    });

    const data = await docDbClient.send(command);
    console.log('Products were added to your db table', data);
  } catch (error) {
    console.error('Error', error);
  }
};

addProductsToDynamoDB();
