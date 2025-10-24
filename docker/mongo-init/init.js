// Script de inicialización para MongoDB - Sistema de Facturación
db = db.getSiblingDB('facturacion');

// Crear usuario para la base de datos facturacion
db.createUser({
  user: 'facturacion_user',
  pwd: 'facturacion_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'facturacion'
    }
  ]
});

// Crear colección de facturas
db.createCollection('facturas');

// Crear índices para optimizar consultas
db.facturas.createIndex({ id: 1 }, { unique: true });
db.facturas.createIndex({ numero_factura: 1 }, { unique: true });
db.facturas.createIndex({ cliente_id: 1 });
db.facturas.createIndex({ fecha_emision: 1 });
db.facturas.createIndex({ "cliente.email": 1 });
db.facturas.createIndex({ "detalles.producto_id": 1 });

print('Base de datos de facturación inicializada correctamente');