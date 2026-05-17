import { Forum } from '../models/Forum';
import { Thread } from '../models/Thread';
import { User } from '../models/User';

export interface ForumResponse {
  forum_id: number;
  title: string;
  description?: string | null;
  category_id?: number | null;
  created_at?: string;
  updated_at?: string;
  category?: {
    category_id: number;
    name: string;
    description?: string | null;
  };
  creator?: {
    user_id: number;
    username: string;
  };
  threads_count?: number;
  latest_thread?: {
    thread_id: number;
    title: string;
    created_at?: string;
    user?: {
      user_id: number;
      username: string;
    };
  };
}

/**
 * Get all forums
 * @param limit maximum number of forums to return
 * @param offset number of forums to skip
 * @param categoryId optional category ID to filter by
 * @returns Promise resolving to array of Forums
 */
export const getAllForums = async (
  limit: number = 50,
  offset: number = 0,
  categoryId?: number
): Promise<ForumResponse[]> => {
  try {
    const whereClause = categoryId ? { category_id: categoryId } : {};
    
    const forums = await Forum.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'username'],
        },
      ],
    });

    // Get additional data for each forum
    const forumsWithStats = await Promise.all(
      forums.map(async (forum) => {
        // Get thread count
        const threadsCount = await Thread.count({
          where: { forum_id: forum.forum_id },
        });

        // Get latest thread
        const latestThread = await Thread.findOne({
          where: { forum_id: forum.forum_id },
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['user_id', 'username'],
            },
          ],
          attributes: ['thread_id', 'title', 'created_at'],
        });

        return {
          ...forum.toJSON(),
          threads_count: threadsCount,
          latest_thread: latestThread ? latestThread.toJSON() : null,
        } as ForumResponse;
      })
    );

    return forumsWithStats;
  } catch (error) {
    throw new Error(`Failed to get all forums: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a forum by its ID
 * @param forumId forum ID
 * @param includeThreads whether to include recent threads
 * @returns Promise resolving to Forum or null if not found
 */
export const getForumById = async (
  forumId: number,
  includeThreads: boolean = false
): Promise<ForumResponse | null> => {
  try {

    const forum = await Forum.findByPk(forumId);

    if (!forum) return null;

    // Get thread count
    const threadsCount = await Thread.count({
      where: { forum_id: forumId },
    });

    // Get latest thread if not already included
    let latestThread = null;
    if (!includeThreads) {
      const latestThreadData = await Thread.findOne({
        where: { forum_id: forumId },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'username'],
          },
        ],
        attributes: ['thread_id', 'title', 'created_at'],
      });
      latestThread = latestThreadData ? latestThreadData.toJSON() : null;
    }

    return {
      ...forum.toJSON(),
      threads_count: threadsCount,
      latest_thread: latestThread,
    } as ForumResponse;
  } catch (error) {
    throw new Error(`Failed to get forum by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get forums by category ID
 * @param categoryId category ID
 * @param limit maximum number of forums to return
 * @param offset number of forums to skip
 * @returns Promise resolving to array of Forums
 */
export const getForumsByCategoryId = async (
  categoryId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ForumResponse[]> => {
  return getAllForums(limit, offset, categoryId);
};

/**
 * Create a new forum (admin only)
 * @param forumData forum data
 * @returns Promise resolving to created Forum
 */
export const createForum = async (forumData: {
  title: string;
  description?: string;
  created_by: number;
}): Promise<ForumResponse> => {
  try {
    const forum = await Forum.create(forumData);
    const createdForum = await getForumById(forum.forum_id, false);

    if (!createdForum) {
      throw new Error('Failed to retrieve created forum');
    }

    return createdForum;
  } catch (error) {
    throw new Error(`Failed to create forum: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update forum information (admin only)
 * @param forumId forum ID
 * @param updateData data to update
 * @returns Promise resolving to updated Forum or null if not found
 */
export const updateForum = async (
  forumId: number,
  updateData: {
    title?: string;
    description?: string;
    category_id?: number;
  }
): Promise<ForumResponse | null> => {
  try {
    const [affectedCount] = await Forum.update(updateData, {
      where: { forum_id: forumId },
    });

    if (affectedCount === 0) return null;

    return getForumById(forumId, false);
  } catch (error) {
    throw new Error(`Failed to update forum: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a forum (admin only)
 * @param forumId forum ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteForum = async (forumId: number): Promise<boolean> => {
  try {
    const deletedCount = await Forum.destroy({
      where: { forum_id: forumId },
    });

    return deletedCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete forum: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  getAllForums,
  getForumById,
  getForumsByCategoryId,
  createForum,
  updateForum,
  deleteForum,
};