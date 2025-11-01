import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { UserStorage } from './user-storage.interface';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy, UserStorage {
  private client: Client;
  private available = false;
  private readonly logger = new Logger(PostgresService.name);

  public ready: Promise<void>;
  private readyResolve: () => void;

  constructor() {
    this.ready = new Promise((res) => {
      this.readyResolve = res;
    });

    const connectionString =
      process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
    this.client = new Client({ connectionString });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL
        );
      `);
      this.available = true;
      this.logger.log('Connected to Postgres and ensured table users exists.');
    } catch (err) {
      this.available = false;
      this.logger.warn('Could not connect to Postgres: ' + err?.message);
    } finally {
      this.readyResolve();
    }
  }

  async onModuleDestroy() {
    if (this.available) {
      await this.client.end();
      this.logger.log('Postgres client disconnected.');
    }
  }

  isAvailable(): boolean {
    return this.available;
  }

  async saveUser(firstName: string, lastName: string): Promise<void> {
    if (!this.available) throw new Error('Postgres not available');
    await this.client.query(
      `INSERT INTO users(first_name, last_name)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name;`,
      [firstName, lastName],
    );
  }

  async getGreeting(): Promise<string> {
    if (!this.available) throw new Error('Postgres not available');
    const res = await this.client.query(`SELECT first_name, last_name FROM users ORDER BY id DESC LIMIT 1;`);
    const firstName = res.rows[0]?.first_name ?? 'John';
    const lastName = res.rows[0]?.last_name ?? 'Doe';
    return `Hello ${firstName} ${lastName} !`;
  }
}
