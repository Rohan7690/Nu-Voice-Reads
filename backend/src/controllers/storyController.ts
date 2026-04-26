import { Response } from 'express';
import { storyService } from '../services/storyService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { verifyAccessToken } from '../auth';

export const storyController = {
  getStories: async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const author = req.query.author as string | undefined;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as string | undefined;

      let filter = {};
      if (author) filter = { author };

      let sortConfig: Record<string, string> = { createdAt: 'desc' };
      if (sort === 'oldest') {
        sortConfig = { createdAt: 'asc' };
      }

      const data = await storyService.getStories(page, limit, filter, search, sortConfig);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  createStory: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, content, isPremium, coverImage } = req.body;
      if (!title || !description || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const story = await storyService.createStory(
        title, 
        description, 
        content, 
        !!isPremium, 
        req.user!.userId, 
        coverImage
      );
      res.status(201).json({ message: 'Story created', story });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  getStoryById: async (req: AuthRequest, res: Response) => {
    try {
      // For single story, auth is optional but we want to check if present for premium access
      let requestUserId: string | undefined = req.user?.userId;
      let requestUserIsPremium: boolean | undefined = req.user?.isPremium;

      // If the middleware wasn't applied to this route, we manually check
      if (!req.user) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
          const token = authHeader.split(' ')[1];
          const payload = verifyAccessToken(token);
          if (payload) {
            requestUserId = payload.userId;
            requestUserIsPremium = payload.isPremium;
          }
        }
      }

      const story = await storyService.getStoryById(req.params.id as string, requestUserId, requestUserIsPremium);
      if (!story) return res.status(404).json({ error: 'Story not found' });

      res.status(200).json(story);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  updateStory: async (req: AuthRequest, res: Response) => {
    try {
      const updatedStory = await storyService.updateStory(req.params.id as string, req.body, req.user!.userId);
      res.status(200).json({ message: 'Story updated', story: updatedStory });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
