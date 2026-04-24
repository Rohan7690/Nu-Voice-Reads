import { storyRepository } from '../repositories/StoryRepository';
import { IStory } from '../models/Story';

export class StoryService {
  async getStories(page: number, limit: number, filter = {}, search?: string, sortConfig: Record<string, any> = { createdAt: -1 }) {
    return storyRepository.findPaginated(page, limit, filter, search, sortConfig);
  }

  async getStoryById(id: string, requestUserId?: string, requestUserIsPremium?: boolean) {
    const story = await storyRepository.findById(id);
    if (!story) return null;

    // Check Premium Logic
    if (story.isPremium) {
      const isAuthor = requestUserId === story.author._id.toString();
      if (!isAuthor && !requestUserIsPremium) {
        // If not author and not premium, lock content
        return {
          ...story.toObject(),
          content: 'This is a premium story. Please subscribe to read the full content.',
          locked: true,
        };
      }
    }

    return {
      ...story.toObject(),
      locked: false,
    };
  }

  async createStory(title: string, description: string, content: string, isPremium: boolean, authorId: string, coverImage?: string) {
    return storyRepository.create({
      title,
      description,
      content,
      isPremium,
      author: authorId as any,
      coverImage
    });
  }

  async updateStory(id: string, updateData: Partial<IStory>, authorId: string) {
     const story = await storyRepository.findById(id);
     if (!story) throw new Error('Story not found');
     if (story.author._id.toString() !== authorId) throw new Error('Not authorized to edit this story');

     return storyRepository.update(id, updateData);
  }
}

export const storyService = new StoryService();
