export const PRODUCT_CREATED_MESSAGE = 'Product was successfully created';
export const GET_PRODUCT_BY_ID_ERROR_MESSAGE = 'Product not found';
export const BASIC_ERROR_MESSAGE = 'Something went wrong';

export const getMissingProductIdErrorMessage = (productId: string): string =>
  `Product with id:${productId} not found`;