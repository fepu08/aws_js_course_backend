import { S3, SQS } from 'aws-sdk';
import csvParser from 'csv-parser';
import { APIGatewayProxyResult, S3Event, S3EventRecord } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, successfulResponse } from '@utils/responses';
import { MetadataBearer } from '@aws-sdk/types';

const s3 = new S3({ region: process.env.REGION });
const sqs = new SQS({ region: process.env.REGION });

const sendResultToSQS = async (data: object) => {
  const { SQS_URL = '' } = process.env;

  const message = await sqs
    .sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify(data),
    })
    .promise();

  console.log(`SentMessage: ${message}`);

  return message;
};

const getProductsFromCSV = async (
  s3: S3,
  params: S3.Types.GetObjectRequest
) => {
  try {
    const products: object[] = [];
    const s3Stream = s3.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
      s3Stream
        .pipe(csvParser())
        .on('data', (data: unknown) => {
          console.log('Product: ', data);
          products.push(data as object);
        })
        .on('end', () => {
          console.log('Stream has ended');
          resolve(products);
        })
        .on('error', (error) => {
          console.log('Error happened in csvParser: ', error);
          reject(error);
        });
    });
  } catch (error) {
    throw new Error(`Error happened in getProductsFromCSV: ${error}`);
  }
};

const moveParsedFiles = async (
  s3: S3,
  params: S3.Types.GetObjectRequest
): Promise<void> => {
  try {
    await s3
      .copyObject({
        Bucket: params.Bucket,
        CopySource: `${params.Bucket}/${params.Key}`,
        Key: params.Key.replace('uploaded', 'parsed'),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: params.Bucket,
        Key: params.Key,
      })
      .promise();
  } catch (error) {
    throw new Error(`Error happened in moveParsedFiles: ${error}`);
  }
};

export const handler = async (
  event: S3Event
): Promise<APIGatewayProxyResult> => {
  try {
    const record: S3EventRecord = event.Records?.[0];

    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    };

    const products = (await getProductsFromCSV(s3, params)) as object[];

    if (!products) {
      return errorResponse(
        { message: 'Could not get csvParsed file', name: 'NotFoundError' },
        StatusCodes.NOT_FOUND
      );
    }

    await Promise.all(products.map((product) => sendResultToSQS(product)));

    await moveParsedFiles(s3, params);

    console.log('Products File processed successfully');

    return successfulResponse(JSON.stringify(products));
  } catch (error) {
    console.error('Error in importFileParser', error);
    return errorResponse({ message: '', name: 'InternalServerError' });
  }
};