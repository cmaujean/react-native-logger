# Logger Schema for Drizzle ORM

This directory contains the internal schema definition for the logger's database tables. 

## Using the Schema in Your Project

We've simplified the process for including the logger's schema in your Drizzle setup:

### 1. Generate the Schema File

After installing the package, run the included script to generate a schema file in your project:

```bash
# Using npm
npx generate-logging-schema

# Using yarn
yarn generate-logging-schema

# Using bun
bun x generate-logging-schema
```

This will create a `logging-schema.ts` file in your `db/` directory.

### 2. Import in Your Schema

In your main Drizzle schema file (typically `db/schema.ts`), import and re-export the logging schema:

```typescript
// In your schema.ts file
import { appLogsTable } from './logging-schema';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Your other table definitions
export const users = sqliteTable('users', {
  // ...
});

// Re-export the logs table so it's included in your schema
export { appLogsTable };
```

### 3. Configure the Database Adapter

After setting up your database with Drizzle, create a database adapter for the logger:

```typescript
import { db } from './db';
import { createDrizzleAdapter } from '@consensu.al/react-native-logger';
import { logger } from './lib/logger';

// Create the adapter
const dbAdapter = createDrizzleAdapter(db);

// Configure the logger to use the adapter
logger.setDatabaseAdapter(dbAdapter);
```

### Schema Structure

The `appLogsTable` defines a table with the following columns:

| Column    | Type   | Description                            |
|-----------|--------|----------------------------------------|
| id        | text   | Primary key, auto-generated using cuid2 |
| timestamp | text   | Timestamp of the log entry, auto-generated |
| level     | text   | Log level (debug, info, warn, error)   |
| message   | text   | The log message                        |
| metadata  | text   | JSON-stringified metadata object       |

### Migrations

When you run your Drizzle migrations, the logs table will be included in the generated migrations along with your other tables.

```bash
# Generate migrations
bun x drizzle-kit generate

# Run migrations
bun x drizzle-kit migrate
```