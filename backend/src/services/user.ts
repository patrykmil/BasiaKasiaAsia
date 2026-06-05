import { User } from '../models/User';
import { Role } from '../models/Role';
import logger from '../config/logger';

export interface UserResponse {
  user_id: number;
  username: string;
  email: string;
  date_of_birth?: Date | null;
  gender?: string | null;
  role_id?: number | null;
  is_banned?: boolean;
  created_at?: string;
  updated_at?: string;
  role?: {
    role_id: number;
    name: string;
  };
}

export class UserService {
  /**
   * Ensure default roles exist in the database
   */
  public async ensureDefaultRoles(): Promise<void> {
    try {
      // Check each required role individually and create if missing
      const defaultRoles = ['user', 'moderator', 'admin'];

      for (const roleName of defaultRoles) {
        const existingRole = await Role.findOne({ where: { name: roleName } });
        if (!existingRole) {
          await Role.create({ name: roleName });
          logger.info(`Default role '${roleName}' created`);
        }
      }
    } catch (error) {
      logger.error('Error ensuring default roles:', error);
    }
  }

  /**
   * Ensure default admin user exists in the database
   */
  public async ensureDefaultAdmin(): Promise<void> {
    try {
      // Check if any admin users exist
      const adminRole = await Role.findOne({ where: { name: 'admin' } });

      if (!adminRole) {
        logger.error('Admin role not found. Please ensure roles are created first.');
        return;
      }

      const adminCount = await User.count({ where: { role_id: adminRole.role_id } });

      if (adminCount === 0) {
        // Create default admin user
        const bcrypt = require('bcrypt');
        const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);

        await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password_hash: hashedPassword,
          role_id: adminRole.role_id,
          gender: 'non-binary',
          date_of_birth: new Date('1990-01-01'),
        });

        logger.info('Default admin user created');
        logger.info(
          'Admin credentials - Email: admin@example.com, Password: ' +
            defaultAdminPassword
        );
        logger.warn('⚠️  Please change the default admin password after first login!');
      }
    } catch (error) {
      logger.error('Error ensuring default admin:', error);
    }
  }

  /**
   * Get default user role ID
   */
  public async getDefaultUserRoleId(): Promise<number | null> {
    try {
      const userRole = await Role.findOne({ where: { name: 'user' } });
      return userRole ? userRole.role_id : null;
    } catch (error) {
      logger.error('Error getting default user role:', error);
      return null;
    }
  }

  /**
   * Get a user by their numeric ID.
   * @param userId numeric user id
   * @param includeRole whether to include role information
   * @returns Promise resolving to User or null if not found
   */
  public async getUserById(
    userId: number,
    includeRole: boolean = false
  ): Promise<UserResponse | null> {
    try {
      const user = await User.findByPk(userId, {
        include: includeRole ? [{ model: Role, as: 'role' }] : [],
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) return null;

      return user.toJSON() as UserResponse;
    } catch (error) {
      throw new Error(
        `Failed to get user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get a user by their nickname.
   * @param nickname user's unique nickname
   * @param includeRole whether to include role information
   * @returns Promise resolving to User or null if not found
   */
  public async getUserByNickname(
    nickname: string,
    includeRole: boolean = false
  ): Promise<UserResponse | null> {
    try {
      const user = await User.findOne({
        where: { username: nickname },
        include: includeRole ? [{ model: Role, as: 'role' }] : [],
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) return null;

      return user.toJSON() as UserResponse;
    } catch (error) {
      throw new Error(
        `Failed to get user by nickname: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get a user by their email (for authentication).
   * @param email user's email
   * @param includePasswordHash whether to include password hash (for auth)
   * @returns Promise resolving to User or null if not found
   */
  public async getUserByEmail(
    email: string,
    includePasswordHash: boolean = false
  ): Promise<any> {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: includePasswordHash ? undefined : { exclude: ['password_hash'] },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['role_id', 'name'],
          },
        ],
      });

      if (!user) return null;
      return user.toJSON();
    } catch (error) {
      throw new Error(
        `Failed to get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get all users (minimal list).
   * @param limit maximum number of users to return
   * @param offset number of users to skip
   * @returns Promise resolving to array of Users
   */
  public async getAllUsers(
    limit: number = 50,
    offset: number = 0
  ): Promise<UserResponse[]> {
    try {
      const users = await User.findAll({
        limit,
        offset,
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Role, as: 'role' }],
        order: [['created_at', 'DESC']],
      });

      return users.map((user) => user.toJSON()) as UserResponse[];
    } catch (error) {
      throw new Error(
        `Failed to get all users: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create a new user.
   * @param userData user data
   * @returns Promise resolving to created User
   */
  public async createUser(userData: {
    username: string;
    email: string;
    password_hash: string;
    date_of_birth: Date | undefined;
    gender: string;
    role_id?: number;
  }): Promise<UserResponse> {
    try {
      // Ensure default roles exist
      await this.ensureDefaultRoles();

      // Validate role_id if provided
      let validatedRoleId: number | undefined = userData.role_id;
      if (userData.role_id) {
        const roleExists = await Role.findByPk(userData.role_id);
        if (!roleExists) {
          logger.warn(
            `Role ID ${userData.role_id} does not exist, using default user role`
          );
          const defaultRoleId = await this.getDefaultUserRoleId();
          validatedRoleId = defaultRoleId || undefined;
        }
      } else {
        // If no role_id provided, use default user role
        const defaultRoleId = await this.getDefaultUserRoleId();
        validatedRoleId = defaultRoleId || undefined;
      }

      const user = await User.create({
        ...userData,
        role_id: validatedRoleId,
      });

      const userResponse = await this.getUserById(user.user_id, true);

      if (!userResponse) {
        throw new Error('Failed to retrieve created user');
      }

      return userResponse;
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update user information.
   * @param userId user ID
   * @param updateData data to update
   * @returns Promise resolving to updated User or null if not found
   */
  public async updateUser(
    userId: number,
    updateData: {
      username?: string;
      email?: string;
      bio?: string;
      role_id?: number;
    }
  ): Promise<UserResponse | null> {
    try {
      const [affectedCount] = await User.update(updateData, {
        where: { user_id: userId },
      });

      if (affectedCount === 0) return null;

      return this.getUserById(userId, true);
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete a user.
   * @param userId user ID
   * @returns Promise resolving to boolean indicating success
   */
  public async deleteUser(userId: number): Promise<boolean> {
    try {
      const deletedCount = await User.destroy({
        where: { user_id: userId },
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Ban a user
   * @param userId user ID
   * @returns Promise resolving to updated User or null if not found
   */
  public async banUser(userId: number): Promise<UserResponse | null> {
    try {
      const [affectedCount] = await User.update(
        { is_banned: true },
        { where: { user_id: userId } }
      );

      if (affectedCount === 0) return null;

      return this.getUserById(userId, true);
    } catch (error) {
      throw new Error(
        `Failed to ban user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Unban a user
   * @param userId user ID
   * @returns Promise resolving to updated User or null if not found
   */
  public async unbanUser(userId: number): Promise<UserResponse | null> {
    try {
      const [affectedCount] = await User.update(
        { is_banned: false },
        { where: { user_id: userId } }
      );

      if (affectedCount === 0) return null;

      return this.getUserById(userId, true);
    } catch (error) {
      throw new Error(
        `Failed to unban user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Singleton instance
const userServiceInstance = new UserService();

// Named exports for backward compatibility (used by index.ts startup)
export const ensureDefaultRoles = () => userServiceInstance.ensureDefaultRoles();
export const ensureDefaultAdmin = () => userServiceInstance.ensureDefaultAdmin();

export default userServiceInstance;
