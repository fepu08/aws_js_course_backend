import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { mockStocks } from '../mocks/stock.mock';
import { docDbClient } from '../services';
import dotenv from 'dotenv';

dotenv.config();
const { STOCKS_TABLE = '' } = process.env;

const addStockToDynamoDB = async () => {
  try {
    const putRequests = mockStocks.map((stock) => ({
      PutRequest: {
        Item: stock,
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [STOCKS_TABLE]: putRequests,
      },
    });

    const data = await docDbClient.send(command);
    console.log('Stocks were added to your db table', data);
  } catch (error) {
    console.error('Error', error);
  }
};

addStockToDynamoDB();
