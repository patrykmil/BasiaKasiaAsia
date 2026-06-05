import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { Forum } from '../models/Forum';
import { Thread } from '../models/Thread';
import { Comment } from '../models/Comment';
import logger from './logger';
import { DatabaseSeeder } from '../seed/seedData';

export class Database {
  private sequelize: Sequelize;
  private seeder: DatabaseSeeder;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_PATH
        ? path.resolve(process.cwd(), process.env.DB_PATH)
        : path.resolve(__dirname, '../../db/database.db'),
      models: [Role, User, Forum, Thread, Comment],
      logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    });

    this.seeder = new DatabaseSeeder();
  }

  /**
   * Get the Sequelize instance
   */
  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  /**
   * Connect to database, sync models, and seed if empty
   */
  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      logger.info(`Database connection established successfully.`);
      logger.info(`Database file: ${this.sequelize.getDatabaseName()}`);

      // Sync models with database
      await this.sequelize.sync();
      logger.info(`Database models synchronized.`);

      // Check if database is empty (after sync)
      const roleCount = await Role.count();
      if (roleCount === 0) {
        await this.seeder.seed();
        logger.info('Database seeded with initial data');
      }
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}

// Singleton instance
const database = new Database();

// Backward-compatible exports
export const sequelize = database.getSequelize();
export const connectDatabase = () => database.connect();

export default database;
