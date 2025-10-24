# API de Facturación - Documentación

## Descripción

Sistema de facturación simplificado con NestJS y MongoDB que permite:
- **Recibir facturas** del sistema analítico
- **Listar facturas** registradas con paginación y filtros
- **Verificar estado** del sistema

## Endpoints Disponibles

### 1. Health Check
```
GET /
```

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Sistema de facturación funcionando correctamente", 
  "timestamp": "2025-10-24T17:33:39.202Z"
}
```

### 2. Recibir Factura
```
POST /facturas/recibir
```

**Body (JSON):**
```json
{
  "data": {
    "id": 1,
    "numero_factura": "FAC000002",
    "fecha_emision": "2025-10-25",
    "total": 4500,
    "cliente_id": 1,
    "cliente": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "555-0101",
      "direccion": "Calle 123 #45-67",
      "identificacion": "1234567890",
      "created_at": "2025-10-24 16:06:57",
      "updated_at": "2025-10-24 16:06:57"
    },
    "consecutivo_id": 1,
    "detalles": [
      {
        "id": 3,
        "producto_id": 1,
        "producto": {
          "id": 1,
          "nombre": "Laptop Dell XPS 15",
          "codigo": "PROD001",
          "precio_unitario": 1500,
          "descripcion": "Laptop de alto rendimiento",
          "created_at": "2025-10-24 16:06:57",
          "updated_at": "2025-10-24 16:06:57"
        },
        "cantidad": 3,
        "precio_unitario": 1500,
        "subtotal": 4500
      }
    ],
    "created_at": "2025-10-24 16:06:57",
    "updated_at": "2025-10-24 16:59:47"
  }
}
```

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "message": "Factura registrada en el sistema analítico"
}
```

### 3. Listar Facturas
```
GET /facturas
```

**Query Parameters (opcionales):**
- `page`: Número de página (default: 1)
- `limit`: Facturas por página (default: 10)
- `cliente_id`: Filtrar por ID de cliente

**Ejemplos de uso:**
```bash
# Todas las facturas (página 1, 10 elementos)
GET /facturas

# Paginación específica
GET /facturas?page=2&limit=5

# Filtrar por cliente
GET /facturas?cliente_id=123

# Combinando filtros
GET /facturas?cliente_id=123&page=1&limit=5
```

### 4. Verificar Factura Existente
```
GET /facturas/verificar/{id}/{numero_factura}
```

**Parámetros:**
- `id`: ID de la factura en el sistema origen
- `numero_factura`: Número de la factura

**Ejemplo:**
```bash
GET /facturas/verificar/999/FAC000002
```

**Respuesta:**
```json
{
  "existePorId": true,
  "existePorNumero": true,
  "facturaExistente": {
    "_id": "68fbc55a50e64797b8e0a048",
    "id": 999,
    "numero_factura": "FAC-DUPLICADO-TEST",
    // ... resto de la factura
  }
}
```

**Respuesta exitosa:**
```json
{
  "facturas": [
    {
      "_id": "68fbc03a50e64797b8e0a036",
      "id": 1,
      "numero_factura": "FAC000002",
      "fecha_emision": "2025-10-25T00:00:00.000Z",
      "total": 4500,
      "cliente_id": 1,
      "cliente": {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "telefono": "555-0101",
        "direccion": "Calle 123 #45-67",
        "identificacion": "1234567890",
        "created_at": "2025-10-24 16:06:57",
        "updated_at": "2025-10-24 16:06:57"
      },
      "consecutivo_id": 1,
      "detalles": [
        {
          "id": 3,
          "producto_id": 1,
          "producto": {
            "id": 1,
            "nombre": "Laptop Dell XPS 15",
            "codigo": "PROD001",
            "precio_unitario": 1500,
            "descripcion": "Laptop de alto rendimiento",
            "created_at": "2025-10-24 16:06:57",
            "updated_at": "2025-10-24 16:06:57"
          },
          "cantidad": 3,
          "precio_unitario": 1500,
          "subtotal": 4500
        }
      ],
      "created_at": "2025-10-24 16:06:57",
      "updated_at": "2025-10-24 16:59:47",
      "createdAt": "2025-10-24T18:06:50.697Z",
      "updatedAt": "2025-10-24T18:06:50.697Z"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## Estructura de Base de Datos

### Colección: `facturas`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Automático | ID único de MongoDB |
| `id` | Number | Sí | ID único de la factura en el sistema origen |
| `numero_factura` | String | Sí | Número único de la factura |
| `fecha_emision` | Date | Sí | Fecha de emisión de la factura |
| `total` | Number | Sí | Total de la factura (≥ 0) |
| `cliente_id` | Number | Sí | ID del cliente |
| `cliente` | Object | Sí | Información completa del cliente |
| `cliente.id` | Number | Sí | ID del cliente |
| `cliente.nombre` | String | Sí | Nombre del cliente |
| `cliente.email` | String | Sí | Email del cliente |
| `cliente.telefono` | String | Sí | Teléfono del cliente |
| `cliente.direccion` | String | Sí | Dirección del cliente |
| `cliente.identificacion` | String | Sí | Identificación del cliente |
| `cliente.created_at` | String | Sí | Fecha de creación del cliente |
| `cliente.updated_at` | String | Sí | Fecha de actualización del cliente |
| `consecutivo_id` | Number | Sí | ID consecutivo |
| `detalles` | Array | Sí | Array de detalles de productos |
| `detalles[].id` | Number | Sí | ID del detalle |
| `detalles[].producto_id` | Number | Sí | ID del producto |
| `detalles[].producto` | Object | Sí | Información completa del producto |
| `detalles[].producto.id` | Number | Sí | ID del producto |
| `detalles[].producto.nombre` | String | Sí | Nombre del producto |
| `detalles[].producto.codigo` | String | Sí | Código del producto |
| `detalles[].producto.precio_unitario` | Number | Sí | Precio unitario del producto |
| `detalles[].producto.descripcion` | String | Sí | Descripción del producto |
| `detalles[].producto.created_at` | String | Sí | Fecha de creación del producto |
| `detalles[].producto.updated_at` | String | Sí | Fecha de actualización del producto |
| `detalles[].cantidad` | Number | Sí | Cantidad del producto (≥ 1) |
| `detalles[].precio_unitario` | Number | Sí | Precio unitario en la factura |
| `detalles[].subtotal` | Number | Sí | Subtotal del detalle |
| `created_at` | String | Sí | Fecha de creación en el sistema origen |
| `updated_at` | String | Sí | Fecha de actualización en el sistema origen |
| `createdAt` | Date | Automático | Fecha de creación en MongoDB |
| `updatedAt` | Date | Automático | Fecha de última actualización en MongoDB |

### Índices
- `id` (único)
- `numero_factura` (único)
- `cliente_id`
- `fecha_emision`
- `cliente.email`
- `detalles.producto_id`

## Validaciones

### Prevención de Duplicados
El sistema previene la duplicación de facturas mediante validaciones en dos niveles:

1. **Validación por ID**: No se pueden registrar dos facturas con el mismo `id`
2. **Validación por Número**: No se pueden registrar dos facturas con el mismo `numero_factura`

**Respuestas de error por duplicación:**
```json
{
  "message": "Ya existe una factura con ID 999",
  "error": "Conflict",
  "statusCode": 409
}
```

```json
{
  "message": "Ya existe una factura con número FAC000002",
  "error": "Conflict", 
  "statusCode": 409
}
```

### Factura Principal
- **id**: Debe ser un número entero único
- **numero_factura**: Debe ser una cadena no vacía
- **fecha_emision**: Debe ser una fecha válida en formato ISO (YYYY-MM-DD)
- **total**: Debe ser un número ≥ 0
- **cliente_id**: Debe ser un número entero
- **consecutivo_id**: Debe ser un número entero

### Cliente
- **id**: Debe ser un número entero
- **nombre**: Debe ser una cadena no vacía
- **email**: Debe ser un email válido
- **telefono**: Debe ser una cadena no vacía
- **direccion**: Debe ser una cadena no vacía
- **identificacion**: Debe ser una cadena no vacía
- **created_at**: Debe ser una cadena no vacía
- **updated_at**: Debe ser una cadena no vacía

### Producto
- **id**: Debe ser un número entero
- **nombre**: Debe ser una cadena no vacía
- **codigo**: Debe ser una cadena no vacía
- **precio_unitario**: Debe ser un número ≥ 0
- **descripcion**: Debe ser una cadena no vacía
- **created_at**: Debe ser una cadena no vacía
- **updated_at**: Debe ser una cadena no vacía

### Detalle de Factura
- **id**: Debe ser un número entero
- **producto_id**: Debe ser un número entero
- **cantidad**: Debe ser un número ≥ 1
- **precio_unitario**: Debe ser un número ≥ 0
- **subtotal**: Debe ser un número ≥ 0

## Ejemplos de Uso

### Ejemplo 1: Registrar una factura completa
```bash
curl -X POST http://localhost:3000/facturas/recibir \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": 1,
      "numero_factura": "FAC000002",
      "fecha_emision": "2025-10-25",
      "total": 4500,
      "cliente_id": 1,
      "cliente": {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "telefono": "555-0101",
        "direccion": "Calle 123 #45-67",
        "identificacion": "1234567890",
        "created_at": "2025-10-24 16:06:57",
        "updated_at": "2025-10-24 16:06:57"
      },
      "consecutivo_id": 1,
      "detalles": [
        {
          "id": 3,
          "producto_id": 1,
          "producto": {
            "id": 1,
            "nombre": "Laptop Dell XPS 15",
            "codigo": "PROD001",
            "precio_unitario": 1500,
            "descripcion": "Laptop de alto rendimiento",
            "created_at": "2025-10-24 16:06:57",
            "updated_at": "2025-10-24 16:06:57"
          },
          "cantidad": 3,
          "precio_unitario": 1500,
          "subtotal": 4500
        }
      ],
      "created_at": "2025-10-24 16:06:57",
      "updated_at": "2025-10-24 16:59:47"
    }
  }'
```

### Ejemplo 2: Listar todas las facturas
```bash
curl -X GET http://localhost:3000/facturas
```

### Ejemplo 3: Listar facturas con paginación
```bash
curl -X GET "http://localhost:3000/facturas?page=1&limit=5"
```

### Ejemplo 4: Filtrar facturas por cliente
```bash
curl -X GET "http://localhost:3000/facturas?cliente_id=123"
```

### Ejemplo 5: Filtros combinados
```bash
curl -X GET "http://localhost:3000/facturas?cliente_id=123&page=1&limit=3"
```

### Ejemplo 7: Verificar si una factura ya existe
```bash
curl -X GET "http://localhost:3000/facturas/verificar/999/FAC000002"
```

### Ejemplo 8: Error por factura duplicada (mismo ID)
```bash
curl -X POST http://localhost:3000/facturas/recibir \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": 999,
      "numero_factura": "FAC-DIFERENTE",
      // ... resto de datos
    }
  }'
```

**Respuesta de error:**
```json
{
  "message": "Ya existe una factura con ID 999",
  "error": "Conflict",
  "statusCode": 409
}
```

### Ejemplo 9: Error por factura duplicada (mismo número)
```bash
curl -X POST http://localhost:3000/facturas/recibir \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": 1001,
      "numero_factura": "FAC000002",
      // ... resto de datos
    }
  }'
```

**Respuesta de error:**
```json
{
  "message": "Ya existe una factura con número FAC000002",
  "error": "Conflict",
  "statusCode": 409
}
```
```bash
curl -X POST http://localhost:3000/facturas/recibir \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "numero_factura": "",
      "total": -100
    }
  }'
```

**Respuesta de error:**
```json
{
  "statusCode": 400,
  "message": [
    "data.id must be a number conforming to the specified constraints",
    "data.numero_factura should not be empty",
    "data.fecha_emision must be a valid ISO 8601 date string",
    "data.total must not be less than 0",
    "data.cliente_id must be a number conforming to the specified constraints",
    "data.cliente should not be empty",
    "data.consecutivo_id must be a number conforming to the specified constraints",
    "data.detalles must be an array",
    "data.created_at should not be empty",
    "data.updated_at should not be empty"
  ],
  "error": "Bad Request"
}
```

## Ejecución del Proyecto

### Desarrollo (recomendado)
```bash
# 1. Levantar MongoDB
npm run docker:dev

# 2. Ejecutar la aplicación
npm run start:dev
```

### Producción con Docker
```bash
# Levantar todos los servicios
npm run docker:prod
```

## Variables de Entorno

```env
# Configuración de MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/facturacion?authSource=admin

# Configuración de la aplicación  
NODE_ENV=development
PORT=3000
```

## Estructura del Proyecto

```
src/
├── dto/
│   ├── cliente.dto.ts            # Validación de datos del cliente
│   ├── producto.dto.ts           # Validación de datos del producto  
│   ├── detalle-factura.dto.ts    # Validación de detalles de factura
│   ├── factura-data.dto.ts       # Validación de estructura principal
│   ├── recibir-factura.dto.ts    # DTO wrapper para recibir facturas
│   └── listar-facturas.dto.ts    # Validación de query parameters
├── schemas/
│   ├── cliente.schema.ts         # Esquema de cliente anidado
│   ├── producto.schema.ts        # Esquema de producto anidado
│   ├── detalle-factura.schema.ts # Esquema de detalle con producto
│   └── factura.schema.ts         # Esquema principal de factura
├── app.controller.ts             # Health check endpoint
├── facturas.controller.ts        # Controlador principal
├── facturas.service.ts           # Lógica de negocio con anti-duplicación
├── app.module.ts                 # Módulo principal
└── main.ts                       # Punto de entrada
```

## Características de Seguridad

### Anti-Duplicación
- ✅ **Validación previa**: Verificación antes de insertar
- ✅ **Índices únicos**: `id` y `numero_factura` únicos en BD
- ✅ **Manejo de errores**: Respuestas HTTP 409 para conflictos
- ✅ **Endpoint de verificación**: Consulta previa de existencia