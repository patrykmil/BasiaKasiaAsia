import { Request, Response } from 'express';
import { ForumService } from '../services/forum';
import logger from '../config/logger';

export class ForumController {
  private forumService: ForumService;

  constructor(forumService: ForumService) {
    this.forumService = forumService;
  }

  /**
   * Get all forums
   */
  public getAllForums = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined;

      // Validate pagination parameters
      if (limit > 100) {
        res.status(400).json({ error: 'Limit cannot exceed 100' });
        return;
      }

      if (limit < 1 || offset < 0) {
        res.status(400).json({ error: 'Invalid pagination parameters' });
        return;
      }

      const forums = await this.forumService.getAllForums(limit, offset, categoryId);

      // Transform forums to the desired format
      const formattedForums = forums.map((forum) => ({
        id: String(forum.forum_id),
        title: forum.title,
        description: forum.description || '',
        creator: forum.creator?.username || 'Unknown',
        created_at: forum.created_at || new Date().toISOString(),
      }));

      res.json(formattedForums);
    } catch (error) {
      logger.error('Error getting all forums:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get forum by ID
   */
  public getForumById = async (req: Request, res: Response): Promise<void> => {
    try {
      const forumId = parseInt(req.params.id as string);
      const includeThreads = req.query.include_threads === 'true';

      if (isNaN(forumId)) {
        res.status(400).json({ error: 'Invalid forum ID' });
        return;
      }

      const forum = await this.forumService.getForumById(forumId, includeThreads);

      if (!forum) {
        res.status(404).json({ error: 'Forum not found' });
        return;
      }

      res.json(forum);
    } catch (error) {
      logger.error('Error getting forum by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get forums by category ID
   */
  public getForumsByCategoryId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const categoryId = parseInt(req.params.categoryId as string);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (isNaN(categoryId)) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      if (limit > 100 || limit < 1 || offset < 0) {
        res.status(400).json({ error: 'Invalid pagination parameters' });
        return;
      }

      const forums = await this.forumService.getForumsByCategoryId(categoryId, limit, offset);

      res.json({
        forums,
        pagination: {
          limit,
          offset,
          count: forums.length,
          has_more: forums.length === limit,
        },
        category_id: categoryId,
      });
    } catch (error) {
      logger.error('Error getting forums by category ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Create new forum (admin only)
   */
  public createForum = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;

      // Validate required fields
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      // Validate title length
      if (title.length < 3 || title.length > 100) {
        res.status(400).json({ error: 'Title must be between 3 and 100 characters' });
        return;
      }

      // Validate description length if provided
      if (description && description.length > 500) {
        res.status(400).json({ error: 'Description cannot exceed 500 characters' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required to create forums' });
        return;
      }

      // Check if user is admin (role_id = 3)
      if (req.user.roleId !== 3) {
        res.status(403).json({ error: 'Only administrators can create forums' });
        return;
      }

      const newForum = await this.forumService.createForum({
        title: title.trim(),
        description: description?.trim(),
        created_by: req.user.userId,
      });

      res.status(201).json(newForum);
    } catch (error) {
      logger.error('Error creating forum:', error);

      if (
        error instanceof Error &&
        error.message.includes('FOREIGN KEY constraint failed')
      ) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Update forum (admin only)
   */
  public updateForum = async (req: Request, res: Response): Promise<void> => {
    try {
      const forumId = parseInt(req.params.id as string);
      const { title, description, category_id } = req.body;

      if (isNaN(forumId)) {
        res.status(400).json({ error: 'Invalid forum ID' });
        return;
      }

      // Validate title length if provided
      if (title && (title.length < 3 || title.length > 100)) {
        res.status(400).json({ error: 'Title must be between 3 and 100 characters' });
        return;
      }

      // Validate description length if provided
      if (description && description.length > 500) {
        res.status(400).json({ error: 'Description cannot exceed 500 characters' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if user is admin (role_id = 3)
      if (req.user.roleId !== 3) {
        res.status(403).json({ error: 'Only administrators can update forums' });
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (category_id !== undefined) updateData.category_id = parseInt(category_id);

      const updatedForum = await this.forumService.updateForum(forumId, updateData);

      if (!updatedForum) {
        res.status(404).json({ error: 'Forum not found' });
        return;
      }

      res.json(updatedForum);
    } catch (error) {
      logger.error('Error updating forum:', error);

      if (
        error instanceof Error &&
        error.message.includes('FOREIGN KEY constraint failed')
      ) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Delete forum (admin only)
   */
  public deleteForum = async (req: Request, res: Response): Promise<void> => {
    try {
      const forumId = parseInt(req.params.id as string);

      if (isNaN(forumId)) {
        res.status(400).json({ error: 'Invalid forum ID' });
        return;
      }

      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if user is admin (role_id = 3)
      if (req.user.roleId !== 3) {
        res.status(403).json({ error: 'Only administrators can delete forums' });
        return;
      }

      // Check if forum exists before attempting to delete
      const existingForum = await this.forumService.getForumById(forumId, false);
      if (!existingForum) {
        res.status(404).json({ error: 'Forum not found' });
        return;
      }

      const deleted = await this.forumService.deleteForum(forumId);

      if (!deleted) {
        res.status(404).json({ error: 'Forum not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting forum:', error);

      if (
        error instanceof Error &&
        error.message.includes('FOREIGN KEY constraint failed')
      ) {
        res.status(400).json({
          error:
            'Cannot delete forum that contains threads. Please delete all threads first.',
        });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default ForumController;
