import { BASIC_ERROR_MESSAGE } from '@utils/messages';
import { ServerResponse } from '@models/api.types';
import { StatusCodes } from 'http-status-codes';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
};

export const errorResponse = (
  error: Error,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR
): ServerResponse => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify({
    message: error.message || BASIC_ERROR_MESSAGE,
  }),
});

export const successfulResponse = (
  body: string,
  statusCode = StatusCodes.OK
): ServerResponse => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify(body),
});