# Storage application
The Storage Management Application is a comprehensive tool designed to manage and track users' stored items across various locations. It's intended to provide an organized interface for users to keep track of their belongings, whether in their personal storages or shared facilities.

## Key Features
- User Authentication: The application offers a secure user registration, login, and verification process. Users can register with a unique username and email and are required to verify their accounts through a generated verification key.
- Storage Management: Users can create, edit, and delete storage locations, including adding detailed descriptions and physical locations.
- Item Tracking: Within each storage, users can maintain a record of individual items, including their names, descriptions, and quantities.
- Image Support: Users can upload images for both storages and individual items, providing a visual catalog of what's stored where.
- Logging and Verification: The application maintains logs of significant events and enables a detailed verification process for added security.
- API-Driven Architecture: Built using Node.js, the application exposes a set of RESTful APIs to interact with the underlying PostgreSQL database, enabling seamless integration with various frontend frameworks.
- Security Measures: Employing packages like "bcrypt" for password hashing and "jsonwebtoken" for token generation, the application maintains high standards of security.
- Email Integration: Through a dedicated mailer class, the application handles sending verification and notification emails to users.

## Installation & Usage
1. Clone this repository `git clone https://github.com/BKaya44/storage-app.git`
2. Install dependencies by running command in root folder of cloned repo  ```npm install```
3. Copy and edit the `sample.env` to `.env` and change the configurations.
5. Start server by running command ``` npm run dev ```
6. Open browser window and navigate to http://localhost:3000/
7. Enjoy!

## Data rules

- Username can only have between 5 to 20 characters


## Database
```sql
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Storages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StorageImages (
    id SERIAL PRIMARY KEY,
    storage_id INTEGER REFERENCES Storages(id),
    user_id INTEGER REFERENCES Users(id),
    path TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Items (
    id SERIAL PRIMARY KEY,
    storage_id INTEGER REFERENCES Storages(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ItemImages (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES Items(id),
    user_id INTEGER REFERENCES Users(id),
    path TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Logs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    info TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    verification_text TEXT NOT NULL,
	active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```