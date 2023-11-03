import { StatusCodes } from 'http-status-codes';
export interface ServerResponse {
  statusCode: StatusCodes;
  headers: { [header: string]: boolean | number | string };
  body: string;
}