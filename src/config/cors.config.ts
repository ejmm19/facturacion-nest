export const CORS_CONFIG = {
  development: {
    origin: true, // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  },
  production: {
    origin: [
      'http://localhost:3001',
      'http://localhost:4200',
      'http://localhost:5173',
      // Agrega aquí los dominios específicos de producción
      // 'https://tu-frontend.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  },
} as const;

export const getCorsConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  return environment === 'production' 
    ? CORS_CONFIG.production 
    : CORS_CONFIG.development;
};