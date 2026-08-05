# Expense Tracker API

A NestJS backend API for the Expense Tracker application.

## Features

- Income CRUD
- Expense CRUD
- Settings API
- Atomic JSON backup restore
- Request validation
- SQLite database with TypeORM
- Configurable CORS
- Backup restore security guard

## Setup

Install dependencies:

```bash
npm install
```

## Environment Variables

PowerShell:

```powershell
$env:CORS_ORIGIN="http://localhost:5173"
$env:BACKUP_API_KEY="your-private-key"
npm run start:dev
```

`CORS_ORIGIN` specifies the frontend URL allowed to access the backend.

The default value is:

```text
http://localhost:5173
```

Multiple origins can be separated using commas:

```powershell
$env:CORS_ORIGIN="http://localhost:5173,https://your-frontend.example.com"
```

During development, backup restore can run without an API key.

In production, `BACKUP_API_KEY` is required. Without it, backup restore is disabled.

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

## Settings API

```text
GET   /settings
PATCH /settings
```

The settings API stores:

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

The settings record uses ID `1`.

## Backup Restore API

```text
PUT /backup/restore
```

When `BACKUP_API_KEY` is configured, include this request header:

```text
X-API-Key: your-private-key
```

Restore replaces the existing:

- Income transactions
- Expense transactions
- Settings

The restore runs inside one database transaction.

If restoration fails, all changes are rolled back.

Transaction IDs are intentionally regenerated during restore. The frontend must use the new records and IDs returned by the backend.

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

## Database

This project uses SQLite with TypeORM.

```text
expense.db
```

## Frontend Repository

```text
https://github.com/mbhandari929/expense-tracker
```