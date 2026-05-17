import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { Thread } from '../models/Thread';
import { Op } from 'sequelize';

export interface CommentResponse {
  comment_id: number;
  thread_id?: number | null;
  user_id?: number | null;
  parent_comment_id?: number | null;
  content: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    user_id: number;
    username: string;
    email: string;
    bio?: string | null;
  };
  replies?: CommentResponse[];
  replies_count?: number;
}

/**
 * Get comments for a thread (hierarchical structure)
 * @param threadId thread ID
 * @param limit maximum number of top-level comments to return
 * @param offset number of top-level comments to skip
 * @param includeReplies whether to include nested replies
 * @returns Promise resolving to array of Comments
 */
export const getCommentsByThreadId = async (
  threadId: number,
  limit: number = 20,
  offset: number = 0,
  includeReplies: boolean = true
): Promise<CommentResponse[]> => {
  try {
    // Get top-level comments (no parent)
    const topLevelComments = await Comment.findAll({
      where: { 
        thread_id: threadId,
        parent_comment_id: null
      },
      limit,
      offset,
      order: [['created_at', 'ASC']], // Oldest first for comments
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
      ],
    });

    if (!includeReplies) {
      return topLevelComments.map(comment => comment.toJSON()) as CommentResponse[];
    }

    // Get replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await getRepliesForComment(comment.comment_id);
        const repliesCount = await Comment.count({
          where: { parent_comment_id: comment.comment_id }
        });

        return {
          ...comment.toJSON(),
          replies,
          replies_count: repliesCount,
        } as CommentResponse;
      })
    );

    return commentsWithReplies;
  } catch (error) {
    throw new Error(`Failed to get comments by thread ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get replies for a specific comment
 * @param parentCommentId parent comment ID
 * @param maxDepth maximum depth of nested replies
 * @returns Promise resolving to array of reply Comments
 */
export const getRepliesForComment = async (
  parentCommentId: number,
  maxDepth: number = 3
): Promise<CommentResponse[]> => {
  try {
    const replies = await Comment.findAll({
      where: { parent_comment_id: parentCommentId },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
      ],
    });

    if (maxDepth <= 1) {
      return replies.map(reply => reply.toJSON()) as CommentResponse[];
    }

    // Recursively get nested replies
    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => {
        const nestedReplies = await getRepliesForComment(reply.comment_id, maxDepth - 1);
        const repliesCount = await Comment.count({
          where: { parent_comment_id: reply.comment_id }
        });

        return {
          ...reply.toJSON(),
          replies: nestedReplies,
          replies_count: repliesCount,
        } as CommentResponse;
      })
    );

    return repliesWithNested;
  } catch (error) {
    throw new Error(`Failed to get replies for comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a comment by its ID
 * @param commentId comment ID
 * @param includeReplies whether to include replies
 * @returns Promise resolving to Comment or null if not found
 */
export const getCommentById = async (
  commentId: number,
  includeReplies: boolean = false
): Promise<CommentResponse | null> => {
  try {
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
      ],
    });

    if (!comment) return null;

    let replies: CommentResponse[] = [];
    let repliesCount = 0;

    if (includeReplies) {
      replies = await getRepliesForComment(commentId);
      repliesCount = await Comment.count({
        where: { parent_comment_id: commentId }
      });
    }

    return {
      ...comment.toJSON(),
      replies: includeReplies ? replies : undefined,
      replies_count: repliesCount,
    } as CommentResponse;
  } catch (error) {
    throw new Error(`Failed to get comment by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get comments by user ID
 * @param userId user ID
 * @param limit maximum number of comments to return
 * @param offset number of comments to skip
 * @returns Promise resolving to array of Comments
 */
export const getCommentsByUserId = async (
  userId: number,
  limit: number = 20,
  offset: number = 0
): Promise<CommentResponse[]> => {
  try {
    const comments = await Comment.findAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']], // Newest first for user's comments
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'email', 'bio'],
        },
        {
          model: Thread,
          as: 'thread',
          attributes: ['thread_id', 'title'],
        },
      ],
    });

    return comments.map(comment => comment.toJSON()) as CommentResponse[];
  } catch (error) {
    throw new Error(`Failed to get comments by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new comment
 * @param commentData comment data
 * @returns Promise resolving to created Comment
 */
export const createComment = async (commentData: {
  thread_id: number;
  user_id: number;
  content: string;
  parent_comment_id?: number;
}): Promise<CommentResponse> => {
  try {
    // Validate parent comment exists if provided
    if (commentData.parent_comment_id) {
      const parentComment = await Comment.findByPk(commentData.parent_comment_id);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      
      // Ensure parent comment belongs to the same thread
      if (parentComment.thread_id !== commentData.thread_id) {
        throw new Error('Parent comment must belong to the same thread');
      }
    }

    const comment = await Comment.create(commentData);
    const createdComment = await getCommentById(comment.comment_id, false);

    if (!createdComment) {
      throw new Error('Failed to retrieve created comment');
    }

    return createdComment;
  } catch (error) {
    throw new Error(`Failed to create comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update comment content
 * @param commentId comment ID
 * @param updateData data to update
 * @returns Promise resolving to updated Comment or null if not found
 */
export const updateComment = async (
  commentId: number,
  updateData: {
    content: string;
  }
): Promise<CommentResponse | null> => {
  try {
    const [affectedCount] = await Comment.update(updateData, {
      where: { comment_id: commentId },
    });

    if (affectedCount === 0) return null;

    return getCommentById(commentId, false);
  } catch (error) {
    throw new Error(`Failed to update comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a comment (and all its replies)
 * @param commentId comment ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteComment = async (commentId: number): Promise<boolean> => {
  try {
    // Delete all replies first (cascade delete)
    await deleteCommentReplies(commentId);
    
    // Delete the comment itself
    const deletedCount = await Comment.destroy({
      where: { comment_id: commentId },
    });

    return deletedCount > 0;
  } catch (error) {
    throw new Error(`Failed to delete comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Recursively delete all replies to a comment
 * @param parentCommentId parent comment ID
 */
const deleteCommentReplies = async (parentCommentId: number): Promise<void> => {
  try {
    const replies = await Comment.findAll({
      where: { parent_comment_id: parentCommentId },
      attributes: ['comment_id'],
    });

    // Recursively delete replies of replies
    for (const reply of replies) {
      await deleteCommentReplies(reply.comment_id);
    }

    // Delete all direct replies
    await Comment.destroy({
      where: { parent_comment_id: parentCommentId },
    });
  } catch (error) {
    throw new Error(`Failed to delete comment replies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get comment statistics for a thread
 * @param threadId thread ID
 * @returns Promise resolving to comment statistics
 */
export const getCommentStats = async (threadId: number) => {
  try {
    const totalComments = await Comment.count({
      where: { thread_id: threadId },
    });

    const topLevelComments = await Comment.count({
      where: { 
        thread_id: threadId,
        parent_comment_id: null 
      },
    });

    const replies = totalComments - topLevelComments;

    return {
      total_comments: totalComments,
      top_level_comments: topLevelComments,
      replies: replies,
    };
  } catch (error) {
    throw new Error(`Failed to get comment stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  getCommentsByThreadId,
  getRepliesForComment,
  getCommentById,
  getCommentsByUserId,
  createComment,
  updateComment,
  deleteComment,
  getCommentStats,
};