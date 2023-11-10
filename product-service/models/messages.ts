export const PRODUCT_CREATED_SUCCESS_MESSAGE =
  'Product was successfully created';
export const PRODUCT_CREATED_ERROR_MESSAGE = 'Product could not be created';
export const GET_PRODUCT_BY_ID_ERROR_MESSAGE = 'Product not found';
export const BASIC_ERROR_MESSAGE = 'Something went wrong';
export const GET_PRODUCTS_ERROR_MESSAGE = 'Products could not be found';

export const getMissingProductIdErrorMessage = (productId: string): string =>
  `Product with id:${productId} not found`;

export const getCatalogBatchProcessErrorMessage = (message: string) =>
  `Error creating product in CatalogBatchProcess: ${message}`;