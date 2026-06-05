import { Request, Response } from 'express';
import { CommentService } from '../services/comment';
import logger from '../config/logger';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  /**
   * Get comments for a thread
   */
  public getCommentsByThreadId = async (req: Request, res: Response): Promise<void> => {
    try {
      const threadId = parseInt(req.params.threadId as string);
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const includeReplies = req.query.include_replies !== 'false'; // Default true

      if (isNaN(threadId)) {
        res.status(400).json({ error: 'Invalid thread ID' });
        return;
      }

      // Validate pagination parameters
      if (limit > 100) {
        res.status(400).json({ error: 'Limit cannot exceed 100' });
        return;
      }

      if (limit < 1 || offset < 0) {
        res.status(400).json({ error: 'Invalid pagination parameters' });
        return;
      }

      const comments = await this.commentService.getCommentsByThreadId(
        threadId,
        limit,
        offset,
        includeReplies
      );

      // Transform comments to simplified format
      const formattedComments = comments.map((comment) => ({
        id: comment.comment_id,
        username: comment.user?.username || 'Unknown',
        date: comment.created_at
          ? new Date(comment.created_at)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .replace(/\//g, '.')
          : '',
        avatar: '/src/assets/img/default-user.svg',
        content: comment.content,
      }));

      res.json(formattedComments);
    } catch (error) {
      logger.error('Error getting comments by thread ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get comment by ID
   */
  public getCommentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentId = parseInt(req.params.id as string);
      const includeReplies = req.query.include_replies === 'true';

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      const comment = await this.commentService.getCommentById(
        commentId,
        includeReplies
      );

      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.json(comment);
    } catch (error) {
      logger.error('Error getting comment by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get replies for a specific comment
   */
  public getRepliesForComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentId = parseInt(req.params.commentId as string);
      const maxDepth = parseInt(req.query.max_depth as string) || 3;

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      if (maxDepth < 1 || maxDepth > 10) {
        res.status(400).json({ error: 'Max depth must be between 1 and 10' });
        return;
      }

      const replies = await this.commentService.getRepliesForComment(
        commentId,
        maxDepth
      );

      res.json({
        replies,
        parent_comment_id: commentId,
        max_depth: maxDepth,
        count: replies.length,
      });
    } catch (error) {
      logger.error('Error getting replies for comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get comments by user ID
   */
  public getCommentsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId as string);
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      if (limit > 100 || limit < 1 || offset < 0) {
        res.status(400).json({ error: 'Invalid pagination parameters' });
        return;
      }

      const comments = await this.commentService.getCommentsByUserId(
        userId,
        limit,
        offset
      );

      res.json({
        comments,
        pagination: {
          limit,
          offset,
          count: comments.length,
          has_more: comments.length === limit,
        },
        user_id: userId,
      });
    } catch (error) {
      logger.error('Error getting comments by user ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Create new comment
   */
  public createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { thread_id, content, parent_comment_id } = req.body;

      // Validate required fields
      if (!thread_id || !content) {
        res.status(400).json({ error: 'Thread ID and content are required' });
        return;
      }

      // Validate content length
      if (content.length < 1 || content.length > 10000) {
        res
          .status(400)
          .json({ error: 'Content must be between 1 and 10000 characters' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required to create comments' });
        return;
      }

      const newComment = await this.commentService.createComment({
        thread_id: parseInt(thread_id),
        user_id: req.user.userId,
        content: content.trim(),
        parent_comment_id: parent_comment_id ? parseInt(parent_comment_id) : undefined,
      });

      res.status(201).json(newComment);
    } catch (error) {
      logger.error('Error creating comment:', error);

      if (error instanceof Error) {
        if (error.message.includes('FOREIGN KEY constraint failed')) {
          res.status(400).json({ error: 'Invalid thread ID or parent comment ID' });
          return;
        }

        if (error.message.includes('Parent comment not found')) {
          res.status(400).json({ error: 'Parent comment not found' });
          return;
        }

        if (error.message.includes('Parent comment must belong to the same thread')) {
          res
            .status(400)
            .json({ error: 'Parent comment must belong to the same thread' });
          return;
        }
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Update comment
   */
  public updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentId = parseInt(req.params.id as string);
      const { content } = req.body;

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      // Validate content
      if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      if (content.length < 1 || content.length > 10000) {
        res
          .status(400)
          .json({ error: 'Content must be between 1 and 10000 characters' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Get the current comment to check ownership
      const currentComment = await this.commentService.getCommentById(commentId, false);
      if (!currentComment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      // Check if user owns the comment or is admin
      if (currentComment.user_id !== req.user.userId && req.user.roleId !== 3) {
        res.status(403).json({ error: "Cannot update another user's comment" });
        return;
      }

      const updatedComment = await this.commentService.updateComment(commentId, {
        content: content.trim(),
      });

      if (!updatedComment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.json(updatedComment);
    } catch (error) {
      logger.error('Error updating comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Delete comment
   */
  public deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const commentId = parseInt(req.params.id as string);

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Get the current comment to check ownership
      const currentComment = await this.commentService.getCommentById(commentId, false);
      if (!currentComment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      // Check if user owns the comment or is admin
      if (currentComment.user_id !== req.user.userId && req.user.roleId !== 3) {
        res.status(403).json({ error: "Cannot delete another user's comment" });
        return;
      }

      const deleted = await this.commentService.deleteComment(commentId);

      if (!deleted) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get comment statistics for a thread
   */
  public getCommentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const threadId = parseInt(req.params.threadId as string);

      if (isNaN(threadId)) {
        res.status(400).json({ error: 'Invalid thread ID' });
        return;
      }

      const stats = await this.commentService.getCommentStats(threadId);

      res.json({
        thread_id: threadId,
        ...stats,
      });
    } catch (error) {
      logger.error('Error getting comment stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default CommentController;
