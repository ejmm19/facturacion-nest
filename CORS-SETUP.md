# 🌐 Configuración de CORS - Sistema de Facturación

## ✅ **CORS Activado y Configurado**

El sistema ahora permite que otros proyectos consuman los endpoints desde diferentes orígenes.

## 🔧 **Configuración Actual**

### **Desarrollo (NODE_ENV != 'production'):**
```javascript
{
  origin: true, // ✅ Permite TODOS los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true // ✅ Permite cookies y credenciales
}
```

### **Producción (NODE_ENV = 'production'):**
```javascript
{
  origin: [
    'http://localhost:3001',
    'http://localhost:4200',  // Angular
    'http://localhost:5173',  // Vite/React
    // Agrega aquí tus dominios de producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}
```

## 🚀 **Cómo Usar desde Tu Otro Proyecto**

### **JavaScript/Fetch:**
```javascript
// Obtener lista de facturas
const response = await fetch('http://localhost:3000/facturas', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Para enviar cookies
});

const data = await response.json();
console.log(data);
```

### **JavaScript/Axios:**
```javascript
import axios from 'axios';

// Configurar base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Para cookies
});

// Obtener facturas
const facturas = await api.get('/facturas');

// Crear nueva factura
const nuevaFactura = await api.post('/facturas/recibir', {
  data: {
    // ... datos de la factura
  }
});
```

### **React Example:**
```jsx
import { useState, useEffect } from 'react';

function FacturasList() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch('http://localhost:3000/facturas');
        const data = await response.json();
        setFacturas(data.facturas);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Facturas ({facturas.length})</h2>
      {facturas.map(factura => (
        <div key={factura._id}>
          <p>Número: {factura.numero_factura}</p>
          <p>Total: ${factura.total}</p>
          <p>Cliente: {factura.cliente.nombre}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Angular Example:**
```typescript
// factura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/facturas`, {
      withCredentials: true
    });
  }

  crearFactura(factura: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/facturas/recibir`, factura, {
      withCredentials: true
    });
  }
}
```

## 🔒 **Configuración de Seguridad**

### **Para Producción:**
1. **Edita** el archivo `/src/config/cors.config.ts`
2. **Agrega** tus dominios específicos:
```typescript
origin: [
  'https://mi-frontend.com',
  'https://app.midominio.com',
  'https://www.misite.com'
],
```

### **Variables de Entorno:**
```bash
# .env
NODE_ENV=production
PORT=3000
```

## 🧪 **Verificar CORS Funcionando**

### **Test con curl:**
```bash
# Test OPTIONS preflight
curl -X OPTIONS http://localhost:3000/facturas \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Debería retornar headers:
# Access-Control-Allow-Origin: http://localhost:3001
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
# Access-Control-Allow-Credentials: true
```

### **Test desde Browser Console:**
```javascript
// Ejecutar en DevTools del navegador
fetch('http://localhost:3000/facturas')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## 📋 **Headers CORS Incluidos**

- ✅ **Access-Control-Allow-Origin**: Orígenes permitidos
- ✅ **Access-Control-Allow-Methods**: Métodos HTTP permitidos  
- ✅ **Access-Control-Allow-Headers**: Headers permitidos
- ✅ **Access-Control-Allow-Credentials**: Permite cookies/auth
- ✅ **Vary: Origin**: Optimización de cache

## 🎯 **Endpoints Disponibles para Consumo Externo**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/facturas` | Listar facturas con paginación |
| `POST` | `/facturas/recibir` | Crear nueva factura |

¡Tu API ahora está lista para ser consumida desde cualquier frontend! 🚀