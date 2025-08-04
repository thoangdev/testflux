import pg from 'pg';
import env from '../utils/validateEnv.js';

const { Pool } = pg;

// Database configuration
const dbConfig = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  statement_timeout: 30000, // Abort any statement that takes more than 30 seconds
  query_timeout: 30000, // Abort any query that takes more than 30 seconds
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool events
pool.on('connect', (client) => {
  console.log('✅ New database client connected');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client', err);
});

pool.on('remove', (client) => {
  console.log('🔌 Database client removed from pool');
});

// Database utility functions
export class Database {
  static async query(text, params = []) {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      
      if (env.NODE_ENV === 'development') {
        console.log('📊 Database query executed', {
          query: text,
          duration: `${duration}ms`,
          rows: result.rowCount,
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Database query error:', {
        query: text,
        params,
        error: error.message,
      });
      throw error;
    }
  }

  static async getClient() {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      console.error('❌ Failed to get database client:', error);
      throw error;
    }
  }

  static async transaction(callback) {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async healthCheck() {
    try {
      const result = await this.query('SELECT 1 as health_check');
      return result.rows[0].health_check === 1;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  static async close() {
    try {
      await pool.end();
      console.log('🔌 Database pool closed');
    } catch (error) {
      console.error('❌ Error closing database pool:', error);
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, closing database connections...');
  await Database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, closing database connections...');
  await Database.close();
  process.exit(0);
});

export default Database;
