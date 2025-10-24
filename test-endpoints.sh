#!/bin/bash

echo "🧪 Testing simplified endpoints..."
echo "======================================"

# Start the application in background
echo "🚀 Starting application..."
npm run start:dev &
APP_PID=$!

# Wait for the app to start
sleep 8

echo ""
echo "📋 Testing GET /facturas (empty list)..."
curl -s http://localhost:3000/facturas | jq .

echo ""
echo "📝 Testing POST /facturas/recibir with sample data..."
curl -s -X POST http://localhost:3000/facturas/recibir \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq .

echo ""
echo "📋 Testing GET /facturas (with data)..."
curl -s http://localhost:3000/facturas | jq .

echo ""
echo "🛑 Stopping application..."
kill $APP_PID
wait $APP_PID 2>/dev/null

echo "✅ Test completed!"