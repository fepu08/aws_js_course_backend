import { NotificationService } from '@services/notificationService';
import { ProductService } from '@services/productService';
import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { getCatalogBatchProcessErrorMessage } from '@models/messages';

const sns = new SNS({ region: process.env.REGION });

export const handler = async (event: SQSEvent) => {
  const productsService = new ProductService();
  const notificationService = new NotificationService();
  try {
    console.log(`Lambda catalogBatchProcess started with request: ${event}`);

    const products = event.Records.map((record) => JSON.parse(record.body));

    await Promise.all(
      products.map((product) => productsService.createProduct({ ...product }))
    );

    await Promise.all(
      products.map((product) =>
        notificationService.sendEmailNotification(sns, product)
      )
    );
  } catch (error: unknown) {
    console.error(
      getCatalogBatchProcessErrorMessage((error as Error)?.message)
    );
    throw new Error(
      getCatalogBatchProcessErrorMessage((error as Error)?.message)
    );
  }
};