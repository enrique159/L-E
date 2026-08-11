# Invitación de boda · Lizbeth y Enrique

Frontend de la invitación construido con Vue y Vite.

## Desarrollo local

```bash
npm install
npm run dev
```

El archivo `.env.development` conecta el frontend local con la API en `http://localhost:3333`.

## Netlify

El archivo `netlify.toml` de la raíz configura automáticamente:

- directorio base: `frontend`
- comando de construcción: `npm run build`
- directorio publicado: `frontend/dist`
- fallback de SPA hacia `index.html`

En **Project configuration → Environment variables** de Netlify agrega:

```env
VITE_API_BASE_URL=https://api.tudominio.com
```

La URL debe usar HTTPS para que el navegador permita las peticiones desde el sitio publicado en Netlify.
