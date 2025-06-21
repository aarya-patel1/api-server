# To-Do List API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. Get All Tasks
- **Endpoint**: `/tasks`
- **Method**: GET
- **Description**: Retrieves all tasks
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2023-05-20T10:00:00.000Z",
      "updated_at": "2023-05-20T10:00:00.000Z"
    }
  ]