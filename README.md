## Storage application

# Database

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

CREATE TABLE Verification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    verification_text TEXT NOT NULL,
	active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```