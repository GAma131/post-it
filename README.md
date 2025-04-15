# Post-it App

Una aplicación web para publicar textos cortos y darles like/dislike.

## Estructura del Proyecto

```
post-it/
├── app/
│   ├── crear/             # Página para crear nuevos posts
│   │   └── page.tsx       # Componente de creación de posts
│   ├── components/        # Componentes React reutilizables
│   ├── lib/               # Utilidades y servicios
│   │   └── services/      # Servicios para llamadas a API
│   ├── styles/            # Estilos adicionales
│   ├── utils/             # Utilidades generales
│   ├── globals.css        # Estilos globales con Tailwind
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── public/                # Archivos estáticos
├── .env.local             # Variables de entorno (API_URL)
├── .gitignore             # Archivos a ignorar en Git
├── next.config.js         # Configuración de Next.js
├── package.json           # Dependencias
├── postcss.config.js      # Configuración de PostCSS
├── tailwind.config.js     # Configuración de Tailwind
└── tsconfig.json          # Configuración de TypeScript
```

## Tecnologías

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios para llamadas API

## Arquitectura

- **Frontend**: Next.js con App Router
- **Manejo de Estado**: React Hooks
- **API**: Conexión a backend externo mediante Axios
- **Rutas**:
  - `/`: Página principal (listado de posts)
  - `/crear`: Página para crear nuevos posts

## Funcionalidades

- Publicar textos cortos
- Conectarse a API externa para persistencia
- Interfaz responsiva con Tailwind CSS

## Variables de Entorno

```
NEXT_PUBLIC_API_URL=http://localhost:3000  # URL de tu API externa
```

## Instalación

1. Clona el repositorio:

   ```
   git clone https://github.com/GAma131/post-it.git
   cd post-it
   ```

2. Instala las dependencias:

   ```
   npm install
   ```

3. Configura el archivo `.env.local` con la URL de tu API.

4. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```

## Despliegue

Para construir la aplicación para producción:

```
npm run build
npm start
```
