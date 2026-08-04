# Expense Tracker API

A NestJS backend API for the Expense Tracker application.

## Features

- Income CRUD
- Expense CRUD
- Settings API
- Request validation
- SQLite database
- Frontend CORS support

## Setup

Install dependencies:

```bash
npm install
```

Start the backend:

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

## Database

This project uses SQLite with TypeORM.

```text
expense.db
```

## Frontend Repository

```text
https://github.com/mbhandari929/expense-tracker
```