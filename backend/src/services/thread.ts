import { Thread } from '../models/Thread';
import { User } from '../models/User';
import { Forum } from '../models/Forum';
import { Comment } from '../models/Comment';

export interface ThreadResponse {
  thread_id: number;
  title: string;
  description?: string | null;
  forum_id?: number | null;
  user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  user?: {
    user_id: number;
    username: string;
    email: string;
    bio?: string | null;
  };
  forum?: {
    forum_id: number;
    title: string;
    description?: string | null;
    category?: {
      category_id: number;
      name: string;
      description?: string | null;
    };
  };
  comments_count?: number;
}

/**
 * Get all threads ordered by newest first
 * @param limit maximum number of threads to return
 * @param offset number of threads to skip
 * @param forumId optional forum ID to filter by
 * @returns Promise resolving to array of Threads
 */
export const getAllThreads = async (
  limit: number = 20,
  offset: number = 0,
  forumId?: number
): Promise<ThreadResponse[]> => {
  try {
    const whereClause = forumId ? { forum_id: forumId } : {};
    
    const threads = await Thread.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']], // Newest first
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['forum_id', 'title', 'description'],
        },
      ],
    });

    // Get comment counts for each thread
    const threadsWithCounts = await Promise.all(
      threads.map(async (thread) => {
        const commentsCount = await Comment.count({
          where: { thread_id: thread.thread_id },
        });

        return {
          ...thread.toJSON(),
          comments_count: commentsCount,
        } as ThreadResponse;
      })
    );

    return threadsWithCounts;
  } catch (error) {
    throw new Error(`Failed to get all threads: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a thread by its ID
 * @param threadId thread ID
 * @param includeComments whether to include comments
 * @returns Promise resolving to Thread or null if not found
 */
export const getThreadById = async (
  threadId: number,
  includeComments: boolean = false
): Promise<ThreadResponse | null> => {
  try {
    const includeOptions = [
      {
        model: User,
        as: 'user',
        attributes: ['user_id', 'username', 'email', 'bio'],
      },
      {
        model: Forum,
        as: 'forum',
        attributes: ['forum_id', 'title', 'description'],
      },
    ];

    if (includeComments) {
      includeOptions.push({
        model: Comment,
        as: 'comments',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'username', 'email'],
          },
        ],
        order: [['created_at', 'ASC']],
      } as any);
    }

    const thread = await Thread.findByPk(threadId, {
      include: includeOptions,
    });

    if (!thread) return null;

    // Get comment count
    const commentsCount = await Comment.count({
      where: { thread_id: threadId },
    });

    return {
      ...thread.toJSON(),
      comments_count: commentsCount,
    } as ThreadResponse;
  } catch (error) {
    throw new Error(`Failed to get thread by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get threads by forum ID ordered by newest first
 * @param forumId forum ID
 * @param limit maximum number of threads to return
 * @param offset number of threads to skip
 * @returns Promise resolving to array of Threads
 */
export const getThreadsByForumId = async (
  forumId: number,
  limit: number = 20,
  offset: number = 0
): Promise<ThreadResponse[]> => {
  return getAllThreads(limit, offset, forumId);
};

/**
 * Get threads by user ID ordered by newest first
 * @param userId user ID
 * @param limit maximum number of threads to return
 * @param offset number of threads to skip
 * @returns Promise resolving to array of Threads
 */
export const getThreadsByUserId = async (
  userId: number,
  limit: number = 20,
  offset: number = 0
): Promise<ThreadResponse[]> => {
  try {
    const threads = await Thread.findAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']], // Newest first
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
        {
          model: Forum,
          as: 'forum',
          attributes: ['forum_id', 'title', 'description'],
        },
      ],
    });

    // Get comment counts for each thread
    const threadsWithCounts = await Promise.all(
      threads.map(async (thread) => {
        const commentsCount = await Comment.count({
          where: { thread_id: thread.thread_id },
        });

        return {
          ...thread.toJSON(),
          comments_count: commentsCount,
        } as ThreadResponse;
      })
    );

    return threadsWithCounts;
  } catch (error) {
    throw new Error(`Failed to get threads by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new thread
 * @param threadData thread data
 * @returns Promise resolving to created Thread
 */
export const createThread = async (threadData: {
  title: string;
  description?: string;
  forum_id: number;
  user_id: number;
}): Promise<ThreadResponse> => {
  try {
    const thread = await Thread.create(threadData);
    const createdThread = await getThreadById(thread.thread_id, false);

    if (!createdThread) {
      throw new Error('Failed to retrieve created thread');
    }

    return createdThread;
  } catch (error) {
    throw new Error(`Failed to create thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update thread information
 * @param threadId thread ID
 * @param updateData data to update
 * @returns Promise resolving to updated Thread or null if not found
 */
export const updateThread = async (
  threadId: number,
  updateData: {
    title?: string;
    description?: string;
    forum_id?: number;
  }
): Promise<ThreadResponse | null> => {
  try {
    const [affectedCount] = await Thread.update(updateData, {
      where: { thread_id: threadId },
    });

    if (affectedCount === 0) return null;

    return getThreadById(threadId, false);
  } catch (error) {
    throw new Error(`Failed to update thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a thread
 * @param threadId thread ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteThread = async (threadId: number): Promise<boolean> => {
  try {
    const deletedCount = await Thread.destroy({
      where: { thread_id: threadId },
    });

    return deletedCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  getAllThreads,
  getThreadById,
  getThreadsByForumId,
  getThreadsByUserId,
  createThread,
  updateThread,
  deleteThread,
};