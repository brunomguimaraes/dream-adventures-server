Setting up a local PostgreSQL database for your project can be easily managed using Docker. This approach will allow you to turn the database on and off as needed. Additionally, for manipulating the data with an interface, you can use tools like pgAdmin or Prisma Studio.

Here are the steps to set up your local PostgreSQL database with Docker and manage it with pgAdmin and Prisma Studio.

### Step 1: Install Docker

First, make sure you have Docker installed on your Mac. You can download it from the [Docker website](https://www.docker.com/products/docker-desktop).

### Step 2: Create a Docker Compose File

Create a `docker-compose.yml` file in your project root directory. This file will define your PostgreSQL and pgAdmin services.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: postgres
    environment:
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: your_database
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: your_email@example.com
      PGADMIN_DEFAULT_PASSWORD: your_password
    ports:
      - "8080:80"

volumes:
  postgres_data:
```

### Step 3: Start the Services

Run the following command to start your PostgreSQL and pgAdmin services:

```sh
docker-compose up -d
```

This command will start the services in detached mode. You can stop the services with:

```sh
docker-compose down
```

### Step 4: Access pgAdmin

Open your web browser and go to `http://localhost:8080`. Log in with the email and password you specified in the `docker-compose.yml` file. You can then add a new server connection in pgAdmin using the following details:

- **Host**: `postgres`
- **Port**: `5432`
- **Username**: `your_username`
- **Password**: `your_password`
- **Database**: `your_database`

### Step 5: Set Up Prisma

Ensure your `prisma/schema.prisma` file is configured to use the PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Your models here
```

Create a `.env` file in your project root directory with the following content:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database"
```

### Step 6: Run Migrations and Generate Prisma Client

Run the following commands to apply migrations and generate the Prisma client:

```sh
npx prisma migrate dev --name init
npx prisma generate
```

### Step 7: Use Prisma Studio

You can use Prisma Studio to interact with your database in a graphical interface. Run the following command:

```sh
npx prisma studio
```

This will open Prisma Studio in your web browser, allowing you to view and manipulate your data.

### Summary

1. **Docker**: Use Docker to easily start and stop your PostgreSQL and pgAdmin services.
2. **pgAdmin**: Use pgAdmin for a graphical interface to manage your PostgreSQL database.
3. **Prisma Studio**: Use Prisma Studio to view and manipulate your data interactively.

With these tools, you can easily set up, manage, and interact with your local PostgreSQL database for your project.