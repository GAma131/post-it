// Configuración de entornos de API
// Cambiar a 'production' para usar la API en producción o 'development' para local
export const API_ENV = "production";

// URLs de la API según el entorno
const API_URLS = {
  development: "http://localhost:3000",
  production: "https://post-it-back.onrender.com",
};

// Exportar la URL base para usar en toda la aplicación
export const API_BASE_URL = API_URLS[API_ENV as keyof typeof API_URLS];

// Función auxiliar para construir URLs de endpoints
export const apiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
};
