import { Router } from 'express';
import { storyController } from '../controllers/storyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', storyController.getStories);
router.post('/', authMiddleware, storyController.createStory);
router.get('/:id', storyController.getStoryById); // Auth is optional here
router.put('/:id', authMiddleware, storyController.updateStory);

export default router;
