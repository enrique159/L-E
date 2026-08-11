# Boda Lizbeth y Enrique API

Backend RESTful con Node.js, Express, TypeScript, MySQL, TypeORM y JWT.

## Configuración

```bash
cp .env.example .env
npm install
npm run dev
```

Antes de iniciar, crea la base de datos indicada en `DB_DATABASE`. Con `DB_SYNCHRONIZE=true`, TypeORM crea las tablas automáticamente en desarrollo.

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
