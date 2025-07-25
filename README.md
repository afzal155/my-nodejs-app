# Node.js Express & TypeScript API

This is a starter template for building a RESTful API using Node.js, Express, and TypeScript. It includes user authentication (registration and login) with JWT and basic task management functionality.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Yarn](https://yarnpkg.com/) (or npm)
- A [MongoDB](https://www.mongodb.com/) database (either local or from a cloud provider like MongoDB Atlas)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd my-nodejs-app
    ```

2.  **Install dependencies:**
    Using Yarn:
    ```bash
    yarn install
    ```
    Or using npm:
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:

    ```env
    PORT=4000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

    - `PORT`: The port on which the server will run.
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, random, and secret string for signing JSON Web Tokens (JWTs).

## How to Run the Application

### Development Mode

To run the server in development mode with hot-reloading (the server will automatically restart when you save a file):

```bash
yarn dev
```

The server will be running on the port specified in your `.env` file (e.g., `http://localhost:4000`).

### Production Mode

1.  **Build the TypeScript code:**
    This command compiles the TypeScript code from the `src` directory into JavaScript in the `dist` directory.
    ```bash
    yarn build
    ```

2.  **Start the server:**
    This command runs the compiled JavaScript code.
    ```bash
    yarn start
    ```

## API Endpoints

### User Routes

- `POST /api/users/register`: Register a new user.
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- `POST /api/users/login`: Log in an existing user and get a JWT.
  - Body: `{ "email": "john@example.com", "password": "password123" }`

### Task Routes (Protected)

*All task routes require a valid JWT in the `Authorization` header (`Authorization: Bearer <token>`).*

- `GET /api/tasks`: Get all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update a task by its ID.
- `DELETE /api/tasks/:id`: Delete a task by its ID.
