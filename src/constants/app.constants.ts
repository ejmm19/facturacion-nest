export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_PAGE: 1,
  MIN_LIMIT: 1,
} as const;

export const HTTP_STATUS_MESSAGES = {
  FACTURA_CREATED: 'Factura registrada exitosamente en el sistema',
  INTERNAL_ERROR: 'Error interno al procesar la factura',
  LIST_ERROR: 'Error al obtener las facturas',
} as const;

export const MONGO_ERROR_CODES = {
  DUPLICATE_KEY: 11000,
} as const;