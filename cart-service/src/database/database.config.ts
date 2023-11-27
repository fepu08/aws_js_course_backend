import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { Cart, CartItem } from '../cart/entities';

export const getDatabaseConfig = async (): Promise<ConnectionOptions> => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Cart, CartItem],
    migrations: [path.join(__dirname, '../migrations/**/*{.ts, .js}')],
    logging: true,
  };
};
