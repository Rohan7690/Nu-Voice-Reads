import Story, { IStory } from '../models/Story';
import mongoose from 'mongoose';

export class StoryRepository {
  async findPaginated(page: number, limit: number, filter: Record<string, any> = {}, search?: string, sortConfig: Record<string, any> = { createdAt: -1 }): Promise<{ stories: IStory[], total: number }> {
    const skip = (page - 1) * limit;
    
    let queryFilter = { ...filter };
    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const stories = await Story.find(queryFilter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email isPremium')
      .exec();

    const total = await Story.countDocuments(queryFilter).exec();

    return { stories, total };
  }

  async findById(id: string): Promise<IStory | null> {
    return Story.findById(id).populate('author', 'name email isPremium').exec();
  }

  async create(storyData: Partial<IStory>): Promise<IStory> {
    return Story.create(storyData);
  }

  async update(id: string, storyData: Partial<IStory>): Promise<IStory | null> {
    return Story.findByIdAndUpdate(id, storyData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await Story.findByIdAndDelete(id).exec();
  }
}

export const storyRepository = new StoryRepository();
