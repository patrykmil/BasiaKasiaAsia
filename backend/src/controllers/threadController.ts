import { Request, Response } from 'express';
import * as threadService from '../services/thread';
import logger from '../config/logger';


/**
 * Get all threads ordered by newest first
 */
export const getAllThreads = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const forumId = req.query.forum_id ? parseInt(req.query.forum_id as string) : undefined;

    // Validate pagination parameters
    if (limit > 100) {
      res.status(400).json({ error: 'Limit cannot exceed 100' });
      return;
    }

    if (limit < 1 || offset < 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const threads = await threadService.getAllThreads(limit, offset, forumId);

    res.json({
      threads,
      pagination: {
        limit,
        offset,
        count: threads.length,
        has_more: threads.length === limit,
      },
      filter: forumId ? { forum_id: forumId } : null,
    });
  } catch (error) {
    logger.error('Error getting all threads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get thread by ID
 */
export const getThreadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const threadId = parseInt(req.params.id);
    const includeComments = req.query.include_comments === 'true';

    if (isNaN(threadId)) {
      res.status(400).json({ error: 'Invalid thread ID' });
      return;
    }

    const thread = await threadService.getThreadById(threadId, includeComments);

    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    // Transform thread to the desired format
    const formattedThread = {
      id: thread.thread_id,
      title: thread.title,
      description: thread.description || '',
      author: thread.user?.username || 'Unknown',
      date: thread.created_at ? new Date(thread.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };

    res.json(formattedThread);
  } catch (error) {
    logger.error('Error getting thread by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get threads by forum ID
 */
export const getThreadsByForumId = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'Invalid forum ID' });
      return;
    }

    if (limit > 100 || limit < 1 || offset < 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const threads = await threadService.getThreadsByForumId(forumId, limit, offset);

    // Transform threads to the desired format
    const formattedThreads = threads.map(thread => ({
      id: String(thread.thread_id),
      title: thread.title,
      author: thread.user?.username || 'Unknown',
      date: thread.created_at ? new Date(thread.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      replies: thread.comments_count || 0,
    }));

    res.json(formattedThreads);
  } catch (error) {
    logger.error('Error getting threads by forum ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get threads by user ID
 */
export const getThreadsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
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

    const threads = await threadService.getThreadsByUserId(userId, limit, offset);

    res.json({
      threads,
      pagination: {
        limit,
        offset,
        count: threads.length,
        has_more: threads.length === limit,
      },
      user_id: userId,
    });
  } catch (error) {
    logger.error('Error getting threads by user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create new thread
 */
export const createThread = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, forum_id } = req.body;

    // Validate required fields
    if (!title || !forum_id) {
      res.status(400).json({ error: 'Title and forum_id are required' });
      return;
    }

    // Validate title length
    if (title.length < 3 || title.length > 200) {
      res.status(400).json({ error: 'Title must be between 3 and 200 characters' });
      return;
    }

    // Validate description length if provided
    if (description && description.length > 10000) {
      res.status(400).json({ error: 'Description cannot exceed 10000 characters' });
      return;
    }

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required to create threads' });
      return;
    }

    const newThread = await threadService.createThread({
      title: title.trim(),
      description: description?.trim(),
      forum_id: parseInt(forum_id),
      user_id: req.user.userId,
    });

    res.status(201).json(newThread);
  } catch (error) {
    logger.error('Error creating thread:', error);

    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      res.status(400).json({ error: 'Invalid forum ID' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update thread
 */
export const updateThread = async (req: Request, res: Response): Promise<void> => {
  try {
    const threadId = parseInt(req.params.id);
    const { title, description, forum_id } = req.body;

    if (isNaN(threadId)) {
      res.status(400).json({ error: 'Invalid thread ID' });
      return;
    }

    // Validate title length if provided
    if (title && (title.length < 3 || title.length > 200)) {
      res.status(400).json({ error: 'Title must be between 3 and 200 characters' });
      return;
    }

    // Validate description length if provided
    if (description && description.length > 10000) {
      res.status(400).json({ error: 'Description cannot exceed 10000 characters' });
      return;
    }

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get the current thread to check ownership
    const currentThread = await threadService.getThreadById(threadId, false);
    if (!currentThread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    // Check if user owns the thread or is admin
    if (currentThread.user_id !== req.user.userId && req.user.roleId !== 1) {
      res.status(403).json({ error: 'Cannot update another user\'s thread' });
      return;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (forum_id !== undefined) updateData.forum_id = parseInt(forum_id);

    const updatedThread = await threadService.updateThread(threadId, updateData);

    if (!updatedThread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    res.json(updatedThread);
  } catch (error) {
    logger.error('Error updating thread:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete thread
 */
export const deleteThread = async (req: Request, res: Response): Promise<void> => {
  try {
    const threadId = parseInt(req.params.id);

    if (isNaN(threadId)) {
      res.status(400).json({ error: 'Invalid thread ID' });
      return;
    }

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Get the current thread to check ownership
    const currentThread = await threadService.getThreadById(threadId, false);
    if (!currentThread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    // Check if user owns the thread or is admin
    if (currentThread.user_id !== req.user.userId && req.user.roleId !== 1) {
      res.status(403).json({ error: 'Cannot delete another user\'s thread' });
      return;
    }

    const deleted = await threadService.deleteThread(threadId);

    if (!deleted) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting thread:', error);
    res.status(500).json({ error: 'Internal server error' });
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