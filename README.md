# Bookstore

This project is a fully containerized bookstore application developed with a microservices architecture. It utilizes modern technologies like JWT for authentication, MongoDB as the database, RabbitMQ and HTTP for inter-service communication, and Memcached for caching. The system is containerized using Docker, with Traefik handling routing and load balancing. The API documentation is available via Swagger.

## Features

- **Microservices Architecture**: Decoupled services for handling authentication, users, books, cart, etc.
- **JWT Authentication**: Secure authentication and authorization.
- **MongoDB**: NoSQL database for storing books, users, and order data.
- **RabbitMQ & HTTP**: Robust communication between services.
- **Memcached**: Efficient caching layer to improve performance.
- **Traefik**: Dynamic routing and load balancing for microservices.
- **Docker**: Fully containerized setup for easy deployment.
- **Swagger**: API documentation available at `/api-docs`.

## Architecture

The system is built using a microservices architecture. Each service is independent and communicates with others via RabbitMQ and HTTP. The services are:

- **Auth Service**: Handles user authentication with JWT.
- **User Service**: Manages user information and roles.
- **Book Service**: Handles book-related operations (CRUD).
- **Cart Service**: Manages the user's shopping cart.

A **Database Seeder** for easy initialization of database collections via `GET` method at `/seeder` endpoint.

A **Document Aggregator** is used to merge the Swagger documentation from all services, providing a unified API documentation accessible at `/api-docs`.

Traefik is used as a reverse proxy and load balancer, managing the routing of requests to the appropriate services.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/bookstore-microservices.git
   cd bookstore-microservices
   ```

2. **Copy and configure the environment variables**:

   The project includes a `.env.sample` file. You must copy this file and rename it to `.env`, then modify the values as needed for your environment.

   ```bash
   cp .env.sample .env
   ```

   **Note:** The application will not run without a properly configured `.env` file.

3. **Build and start the containers**:

   ```bash
   docker-compose up --build -d
   ```

4. **Verify the services are running**:

   ```bash
   docker ps
   ```

## Configuration

All configurations are managed via environment variables. A `.env.sample` file is provided in the project. Copy this file to `.env` and modify it according to your setup. The application will not function without this configuration.

### Swagger API Documentation

After starting the application, navigate to [http://localhost:9000/api-docs](http://localhost:9000/api-docs) to access the Swagger API documentation.

### Database Seeding

To initialize the database with default data, you can use the seeder functionality:

1. Access the seeder endpoint at [http://localhost:9000/seeder](http://localhost:9000/seeder).
2. Send a `GET` request to initialize the database.

## ERD

Below is the Entity-Relationship Diagram (ERD) for the bookstore system:

[ERD Diagram](https://drive.google.com/file/d/1GbpVd6QnuCqHAEkn3OFY5TqoCjsKFVQL/view?usp=drive_link)
