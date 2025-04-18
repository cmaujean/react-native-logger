# Logger Schema for Drizzle ORM

This directory contains the schema definition for the logger's database tables. The schema is designed to work with Drizzle ORM and SQLite.

## Usage in your project

### 1. Import the schema directly

For Drizzle migrations and schema definitions, import the schema directly using the subpath export:

```typescript
// In your schema.ts file
import { appLogsTable } from '@consensu.al/react-native-logger/schema';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Your other table definitions
export const users = sqliteTable('users', {
  // ...
});

// Re-export the logs table so it's included in your schema
export { appLogsTable };
```

### 2. Configure the database adapter

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
bun run db:generate

# Run migrations
bun run db:migrate
```