# Facturación NestJS con MongoDB

Este proyecto utiliza NestJS como framework backend y MongoDB como base de datos, todo configurado con Docker.

## Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- npm o yarn

## Configuración

### 1. Variables de entorno

Copia el archivo de ejemplo y ajusta las variables según tus necesidades:

```bash
cp .env.example .env
```

### 2. Desarrollo Local

Para desarrollo local, solo necesitas levantar MongoDB en Docker:

```bash
# Levantar solo MongoDB
npm run docker:dev

# Instalar dependencias
npm install

# Ejecutar la aplicación en modo desarrollo
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000` y MongoDB en `mongodb://localhost:27017`

### 3. Producción con Docker

Para ejecutar toda la aplicación en contenedores:

```bash
# Construir y levantar todos los servicios
npm run docker:prod

# Ver logs
docker-compose logs -f

# Parar los servicios
npm run docker:prod:down
```

## Servicios

### MongoDB
- **Puerto**: 27017
- **Usuario admin**: admin
- **Contraseña admin**: password123
- **Base de datos**: facturacion
- **Usuario de aplicación**: facturacion_user
- **Contraseña de aplicación**: facturacion_pass

### Aplicación NestJS
- **Puerto**: 3000
- **Entorno**: development/production

## Comandos útiles

```bash
# Desarrollo
npm run docker:dev           # Levantar solo MongoDB
npm run docker:dev:down      # Parar MongoDB
npm run docker:dev:logs      # Ver logs de MongoDB

# Producción
npm run docker:prod          # Levantar todos los servicios
npm run docker:prod:down     # Parar todos los servicios
npm run docker:build         # Construir las imágenes

# Aplicación
npm run start:dev            # Desarrollo con hot reload
npm run start:prod           # Producción
npm run build               # Construir para producción
```

## Estructura de la base de datos

El script de inicialización (`docker/mongo-init/init.js`) crea:

- Usuario de base de datos
- Colecciones: usuarios, facturas, productos
- Datos de ejemplo

## Conexión a MongoDB

La aplicación se conecta a MongoDB usando la URI definida en las variables de entorno:

```
MONGODB_URI=mongodb://admin:password123@localhost:27017/facturacion?authSource=admin
```

## Esquemas de ejemplo

El proyecto incluye esquemas de ejemplo en `src/schemas/`:
- `usuario.schema.ts`: Esquema de usuarios
- `producto.schema.ts`: Esquema de productos

## Desarrollo

1. Levantar MongoDB: `npm run docker:dev`
2. Instalar dependencias: `npm install`
3. Ejecutar en desarrollo: `npm run start:dev`
4. La aplicación se recarga automáticamente con los cambios

## Troubleshooting

### MongoDB no se conecta
- Verificar que Docker esté corriendo
- Verificar que el puerto 27017 no esté ocupado
- Revisar los logs: `npm run docker:dev:logs`

### Problemas con permisos
- En Linux/Mac, asegúrate de que Docker tenga permisos adecuados
- Revisar ownership de los volúmenes de Docker

### Reset de datos
```bash
# Parar servicios y eliminar volúmenes
npm run docker:dev:down
docker volume rm nest-facturacion_mongodb_dev_data

# Levantar de nuevo (recreará la base de datos)
npm run docker:dev
```