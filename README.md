# Item Manager

A small CRUD system for managing items — built from the user-flow diagram.
**Stack:** Laravel 13 (API) · Vue 3 SPA (Vite) · PostgreSQL.

Each item has three fields (per the diagram):

| Field           | Meaning            |
|-----------------|--------------------|
| `name`          | item identifier    |
| `specification` | details / attributes |
| `label`         | grouping tag / category |

## Login & accounts

The whole app sits behind authentication (Laravel Sanctum, cookie-based SPA auth).

- Demo **admin**: `admin@example.com` / `password`
- Demo **user**: `user@example.com` / `password`
- New visitors can **self-register** at `/register` (created as regular users).
- Unauthenticated visitors are redirected to `/login`; the item API returns `401`.
- **Admins** get a **Users** page (`/users`) to create / edit / delete accounts and
  toggle the admin flag. Non-admins are blocked (`403`).

## Features (mapped to the flowchart)

- **Login / register / logout** gate in front of the dashboard, with a "Remember me" option.
- **User management** (admin only): list, add, edit, delete users; can't delete your own account.
- **Dashboard** with an always-visible **search bar** (searches name, label & specification) + category filter.
- **Create** — Add item form → validate input → save → success toast.
- **View / Search** — search/filter → item list → item detail view.
- **Update** — select item → pre-filled edit form → save changes → confirmation toast.
- **Delete** — select item → confirm dialog → delete → deleted toast.
- Inline validation errors (HTTP 422) shown under each field.

## Requirements

- PHP **8.3** (Laragon: `C:\laragon\bin\php\php-8.3.10`)
- Node.js 20.19+ / 22.12+ and npm
- PostgreSQL (running, DB `mini_project`)

> The system PHP in this Laragon is 7.0 — always run artisan with the 8.3 binary,
> e.g. `C:\laragon\bin\php\php-8.3.10\php.exe artisan ...`. `start-dev.bat` does this for you.

## Setup (already done, kept for reference)

```bash
# .env -> DB_CONNECTION=pgsql, DB_DATABASE=mini_project, DB_USERNAME=postgres
php artisan migrate:fresh --seed   # creates tables + 6 sample items
npm install
npm run build
```

## Run

Double-click **`start-dev.bat`**, or manually in two terminals:

```bash
npm run dev                                              # Vite (hot reload)
C:\laragon\bin\php\php-8.3.10\php.exe artisan serve      # http://127.0.0.1:8000
```

Open **http://127.0.0.1:8000**.

## API

| Method | Endpoint              | Purpose                          |
|--------|-----------------------|----------------------------------|
| GET    | `/sanctum/csrf-cookie`| Prime CSRF cookie (before login) |
| POST   | `/api/register`       | Self-register + auto login       |
| POST   | `/api/login`          | Log in (session cookie)          |
| POST   | `/api/logout`         | Log out                          |
| GET    | `/api/user`           | Current authenticated user       |
| GET/POST/PUT/DELETE | `/api/users`| User management (**admin only**) |
| GET    | `/api/items?q=&label=`| List / search / filter items (auth) |
| GET    | `/api/items/labels`   | Distinct labels (for filter)     |
| GET    | `/api/items/{id}`     | Item detail                      |
| POST   | `/api/items`          | Create (validated)               |
| PUT    | `/api/items/{id}`     | Update (validated)               |
| DELETE | `/api/items/{id}`     | Delete                           |
