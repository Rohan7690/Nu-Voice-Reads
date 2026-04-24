import { Router, Request, Response } from 'express';
import { storyService } from '../services/storyService';
import { verifyAccessToken } from '../auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const author = req.query.author as string | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string | undefined;

    let filter = {};
    if (author) filter = { author };

    let sortConfig: Record<string, string> = { createdAt: 'desc' }; // default latest
    if (sort === 'oldest') {
      sortConfig = { createdAt: 'asc' };
    }

    const data = await storyService.getStories(page, limit, filter, search, sortConfig);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const { title, description, content, isPremium, coverImage } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const story = await storyService.createStory(title, description, content, !!isPremium, payload.userId, coverImage);
    res.status(201).json({ message: 'Story created', story });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    let requestUserId: string | undefined;
    let requestUserIsPremium: boolean | undefined;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      if (payload) {
        requestUserId = payload.userId;
        requestUserIsPremium = payload.isPremium;
      }
    }

    const story = await storyService.getStoryById(req.params.id as string, requestUserId, requestUserIsPremium);
    if (!story) return res.status(404).json({ error: 'Story not found' });

    res.status(200).json(story);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });
    
        const updatedStory = await storyService.updateStory(req.params.id as string, req.body, payload.userId);
        res.status(200).json({ message: 'Story updated', story: updatedStory });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
});

export default router;
