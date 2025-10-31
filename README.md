# CambiosJL - Node/Express migration

This workspace contains a migration of the original C# API to Node.js with Express.

Files included
- `server.js` - entry point
- `src/db.js` - MySQL pool using `mysql2/promise`
- `src/models/user.js` - User model (shape only)
- `src/dto.js` - ApiResponse helpers
- `src/repositories/userRepository.js` - DB access with parameterized queries
- `src/controllers/userController.js` - Express controller methods mirroring the C# controller
- `src/routes/userRoutes.js` - Router that mounts the routes

Environment

This project uses a single `.env` file in the repository root for configuration. **Do not commit `.env` to source control.** The `.env` contains DB credentials and JWT settings. Example variables you should set in `.env`:

```
PORT=3000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306
JWT_SECRET=replace_this_with_a_strong_secret
JWT_EXPIRES_IN=24h
```

Quick start (Linux)

1. Copy or create `.env` in the project root and fill the values above.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

Development

Use `npm run dev` if you have `nodemon` installed:

```bash
npm run dev
```

Routes

- GET /api/user (protected)
- GET /api/user/:id (protected)
- POST /api/user (public - create user)
- PUT /api/user/:id (protected)
- DELETE /api/user/:id (protected)
- POST /api/user/login (public)
- GET /api/user/search?email=... (public)

Authentication

- Login: POST `/api/user/login` with JSON body `{ "correo": "...", "password": "..." }`. Response contains `data.token` (JWT).
- Use header `Authorization: Bearer <token>` to call protected routes.
- Tokens default to 24h expiry and the secret is read from `JWT_SECRET` in `.env`.

Recommendations

- Hash passwords with `bcrypt` before storing (recommended). The current implementation mirrors the original behavior but you should migrate to hashed passwords.
- Use short-lived access tokens and refresh tokens if you need longer sessions.
- Add role checks for sensitive endpoints (e.g. DELETE).

Deployment tips (systemd)

Create a systemd service file `/etc/systemd/system/cambiosjl.service` (example):

```
[Unit]
Description=CambiosJL Node API
After=network.target

[Service]
WorkingDirectory=/path/to/project
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cambiosjl
sudo systemctl start cambiosjl
```

License and notes

- Ensure `.env` is not pushed to remote repositories. Use deployment secrets on your server or CI/CD.
- Consider adding automatic migrations and a backup strategy for the DB.

