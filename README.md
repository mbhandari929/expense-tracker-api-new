# Expense Tracker API

A NestJS backend API for the Expense Tracker application.

## Features

- User registration and login
- JWT authentication
- User-specific Income CRUD
- User-specific Expense CRUD
- User-specific Settings API
- User-specific atomic JSON backup restore
- Request validation
- SQLite database with TypeORM
- Configurable CORS

## Setup

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Configure the following values in `.env`:

```env
NODE_ENV=development
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:5173
```

`JWT_SECRET` is used to sign and verify JWT access tokens.

`CORS_ORIGIN` specifies the frontend URL allowed to access the backend.

The default frontend URL is:

```text
http://localhost:5173
```

Multiple origins can be separated using commas:

```env
CORS_ORIGIN=http://localhost:5173,https://your-frontend.example.com
```

## Start the Backend

```bash
npm run start:dev
```

Backend URL:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Authentication

### Register

```text
POST /auth/register
```

Example:

```json
{
  "email": "test@example.com",
  "password": "test1234"
}
```

### Login

```text
POST /auth/login
```

Example:

```json
{
  "email": "test@example.com",
  "password": "test1234"
}
```

A successful login returns a JWT access token:

```json
{
  "access_token": "your-jwt-access-token"
}
```

Protected API requests must include the JWT token:

```text
Authorization: Bearer <access_token>
```

## Income API

```text
GET    /income
GET    /income/:id
POST   /income
PATCH  /income/:id
DELETE /income/:id
```

Example:

```json
{
  "text": "Salary",
  "amount": 50000,
  "date": "2026-08-04"
}
```

Income amounts must be greater than `0`.

Income records are available only to the authenticated user who owns them.

## Expense API

```text
GET    /expense
GET    /expense/:id
POST   /expense
PATCH  /expense/:id
DELETE /expense/:id
```

Example:

```json
{
  "text": "Food",
  "amount": 1000,
  "date": "2026-08-04"
}
```

Expense amounts must be greater than `0`.

Expense records are available only to the authenticated user who owns them.

## Settings API

```text
GET   /settings
PATCH /settings
```

The Settings API stores:

- Opening balance
- Income sources
- Expense sources
- Monthly budgets

Example:

```json
{
  "openingBalance": 100000,
  "incomeSources": ["Salary", "Bonus", "Other"],
  "expenseSources": ["Food", "Rent", "Transport", "Other"],
  "monthlyBudgets": {
    "2026-08": 200000
  }
}
```

Monthly-budget keys must use the `YYYY-MM` format.

Monthly-budget values must be non-negative numbers.

Each authenticated user has their own settings.

## Backup Restore API

```text
PUT /backup/restore
```

The endpoint requires JWT authentication:

```text
Authorization: Bearer <access_token>
```

Restore replaces only the authenticated user's existing:

- Income transactions
- Expense transactions
- Settings

Other users' data is not modified.

The restore runs inside one database transaction.

If restoration fails, all changes are rolled back.

Transaction IDs are intentionally regenerated during restore. The frontend uses the new records and IDs returned by the backend.

## CORS

Allowed HTTP methods:

```text
GET
POST
PATCH
PUT
DELETE
OPTIONS
```

Allowed request headers:

```text
Content-Type
Authorization
```

## Database

This project uses SQLite with TypeORM.

```text
expense.db
```

## Frontend Repository

```text
https://github.com/mbhandari929/expense-tracker
```