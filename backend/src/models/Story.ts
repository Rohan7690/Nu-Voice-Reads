import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IStory extends Document {
  title: string;
  description: string;
  content: string;
  author: mongoose.Types.ObjectId | IUser;
  coverImage?: string;
  isPremium: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPremium: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>('Story', storySchema);

export default Story;
