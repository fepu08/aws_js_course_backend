import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, successfulResponse } from '@utils/responses';

const s3 = new S3({ region: process.env.REGION });
const BUCKET = process.env.BUCKET;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
      return errorResponse(
        { message: 'Query parameter "name" is missing', name: 'NotFoundError' },
        StatusCodes.NOT_FOUND
      );
    }

    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    return successfulResponse(signedUrl);
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return errorResponse({ message: '', name: 'InternalServerError' });
  }
};