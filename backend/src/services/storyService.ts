import { storyRepository } from '../repositories/StoryRepository';
import { IStory } from '../models/Story';

export class StoryService {
  private calculateReadingTime(content: string | any): number {
    if (!content || typeof content !== 'string') return 1;

    const wordsPerMinute = 225;
    
    // 1. Remove HTML tags and replace with space
    let text = content.replace(/<[^>]*>?/gm, ' ');
    
    // 2. Replace common whitespace HTML entities with standard space
    text = text.replace(/&nbsp;|&#160;|&ensp;|&emsp;|&thinsp;/g, ' ');
    
    // 3. Replace any other HTML entities with a space (to be safe)
    text = text.replace(/&[a-z0-9#]+;/gi, ' ');
    
    // 4. Split by any whitespace (including newlines, tabs, and Unicode spaces)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Log to backend console so user can verify the count
    console.log(`[ReadingTime Debug] Word count: ${wordCount}, Calculated min: ${Math.ceil(wordCount / wordsPerMinute)}`);

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  async getStories(page: number, limit: number, filter = {}, search?: string, sortConfig: Record<string, any> = { createdAt: -1 }) {
    const data = await storyRepository.findPaginated(page, limit, filter, search, sortConfig);
    return {
      ...data,
      stories: data.stories.map(story => ({
        ...story.toObject(),
        readingTime: this.calculateReadingTime(story.content)
      }))
    };
  }

  async getStoryById(id: string, requestUserId?: string, requestUserIsPremium?: boolean) {
    const story = await storyRepository.findById(id);
    if (!story) return null;

    const readingTime = this.calculateReadingTime(story.content);

    // Check Premium Logic
    if (story.isPremium) {
      const isAuthor = requestUserId === story.author._id.toString();
      if (!isAuthor && !requestUserIsPremium) {
        // If not author and not premium, lock content
        return {
          ...story.toObject(),
          content: 'This is a premium story. Please subscribe to read the full content.',
          locked: true,
          readingTime
        };
      }
    }

    return {
      ...story.toObject(),
      locked: false,
      readingTime
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
