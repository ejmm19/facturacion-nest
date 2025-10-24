# 📊 Sistema de Facturación Simplificado

## 🎯 Endpoints Disponibles

### ✅ **POST /facturas/recibir**
Recibe una nueva factura en el sistema.

**Estructura de datos requerida:**
```json
{
  "data": {
    "id": 1,
    "numero_factura": "FAC-001",
    "fecha_emision": "2025-10-24T13:30:00.000Z",
    "total": 34.10,
    "cliente_id": 123,
    "consecutivo_id": 1001,
    "cliente": {
      "id": 123,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "555-1234",
      "direccion": "Calle 123 #45-67",
      "identificacion": "12345678",
      "created_at": "2025-10-24T13:30:00.000Z",
      "updated_at": "2025-10-24T13:30:00.000Z"
    },
    "detalles": [
      {
        "id": 1,
        "cantidad": 2,
        "precio_unitario": 15.50,
        "subtotal": 31.00,
        "producto_id": 1,
        "producto": {
          "id": 1,
          "nombre": "Producto A",
          "codigo": "PROD-001",
          "precio_unitario": 15.50,
          "descripcion": "Descripción del producto A",
          "created_at": "2025-10-24T13:30:00.000Z",
          "updated_at": "2025-10-24T13:30:00.000Z"
        }
      }
    ],
    "created_at": "2025-10-24T13:30:00.000Z",
    "updated_at": "2025-10-24T13:30:00.000Z"
  }
}
```

### ✅ **GET /facturas**
Lista todas las facturas con paginación.

**Parámetros opcionales:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)  
- `cliente_id`: Filtrar por cliente específico

**Ejemplo de respuesta:**
```json
{
  "facturas": [...],
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

## 🔧 Scripts de Gestión

### Limpiar base de datos
```bash
npm run db:clean
```

### Reset completo del proyecto
```bash
npm run db:reset
```

### Iniciar aplicación
```bash
npm run start:dev
```

## ✅ Funcionalidades

- ✅ **Prevención de duplicados**: Por ID y número de factura
- ✅ **Validación robusta**: Estructura de datos completa
- ✅ **Paginación**: En el listado de facturas
- ✅ **Base de datos**: MongoDB con Docker
- ✅ **Estructura anidada**: Cliente y productos embebidos
- ✅ **Scripts de gestión**: Para limpiar y reiniciar

## 🚀 Uso

1. Inicia Docker: `docker-compose -f docker-compose.dev.yml up -d`
2. Inicia la aplicación: `npm run start:dev`
3. La API estará disponible en: `http://localhost:3000`

El sistema está **listo para recibir facturas** y mantener un registro organizado con prevención de duplicados.