import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({
  region: process.env.REGION,
});

export const docDbClient = DynamoDBDocumentClient.from(dbClient);