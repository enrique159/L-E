# Boda Lizbeth y Enrique API

Backend RESTful con Node.js, Express, TypeScript, MySQL, TypeORM y JWT.

## Configuración

```bash
cp .env.example .env
npm install
npm run dev
```

Antes de iniciar, crea la base de datos indicada en `DB_DATABASE`. La API escucha en el puerto `3333` tanto en desarrollo como en producción. TypeORM mantiene `synchronize` activo en todos los entornos y crea o actualiza las tablas automáticamente.

Para producción en el VPS:

```bash
npm ci
npm run build
npm start
```

La API quedará disponible internamente en `http://127.0.0.1:3333`. Publícala mediante un dominio HTTPS y un proxy inverso antes de conectarla con el frontend de Netlify.

En producción debes configurar `CORS_ORIGINS` con el dominio exacto de Netlify. Si necesitas varios dominios, sepáralos con comas. El administrador inicial se crea únicamente cuando no existe `ADMIN_USERNAME` y está configurada `ADMIN_PASSWORD`.

## Panel administrativo

El frontend incluye estas rutas:

- `/admin/login`: inicio de sesión
- `/admin`: gestión de invitados y confirmaciones

La sesión usa el JWT de `POST /api/auth/login`. Los listados y todas las operaciones de administración requieren rol `admin`.

Usuario inicial:

- `username`: `admin`
- `password`: `Admin2026$`

## Endpoints

- `GET /health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users` requiere usuario `admin`
- `GET /api/users/:id`
- `PATCH /api/users/:id` requiere usuario `admin`
- `DELETE /api/users/:id` requiere usuario `admin`
- `GET /api/guests`
- `POST /api/guests`
- `GET /api/guests/:id`
- `PATCH /api/guests/:id`
- `DELETE /api/guests/:id`
- `POST /api/rsvps` público; registra una confirmación única por teléfono

Ejemplo de confirmación:

```json
{
  "name": "María García",
  "phone": "6691234567",
  "attendance": "yes",
  "guest_count": 2,
  "note": "Una persona requiere menú vegetariano"
}
```

El teléfono se normaliza a 10 dígitos en el servidor. Si ya existe, la API responde con estado `409` y código `RSVP_PHONE_EXISTS`.

Usa el token JWT en la cabecera:

```http
Authorization: Bearer <token>
```

Ejemplo de invitado:

```json
{
  "name": "María",
  "surname": "García",
  "phone": "5551234567",
  "email": "maria@example.com",
  "relationship": "Familia",
  "priority": 1,
  "group": "Mesa 1",
  "notes": "Vegetariana",
  "already_invited": false
}
```
