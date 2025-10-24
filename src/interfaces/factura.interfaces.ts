export interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface FacturaListResponse {
  facturas: any[];
  metadata: PaginationMetadata;
}

export interface FacturaCreationResponse {
  status: string;
  message: string;
  data: {
    factura_id: string;
    numero_factura: string;
    created_at: string;
  };
}

export interface FacturaFilters {
  cliente_id?: number;
  numero_factura?: any; // Permitir tanto string como objetos MongoDB
}