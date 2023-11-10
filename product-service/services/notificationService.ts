import { Product } from '@models/product.types';
import { SNS } from 'aws-sdk';

export class NotificationService {
  async sendEmailNotification(sns: SNS, product: Product) {
    console.log('Product: ', product);
    return await sns
      .publish({
        Subject: `New product received: ${product.title}`,
        Message: JSON.stringify(product),
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: `${product.price}`,
          },
        },
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
      .promise();
  }
}