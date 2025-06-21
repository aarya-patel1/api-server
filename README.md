# api-server
# My API Server

Simple API server with 4 endpoints (CRUD).

## APIs

- POST `/items` - create item
- GET `/items` - get all items
- PUT `/items/:id` - update item
- DELETE `/items/:id` - delete item

## Database

SQLite (in-memory)

## How to Run

```bash
npm install
node server.js
