import User, { IUser } from '../models/User';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await User.findByIdAndUpdate(id, { refreshToken }).exec();
  }

  async updatePremiumStatus(email: string, isPremium: boolean): Promise<void> {
    const expiryDate = isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
    await User.findOneAndUpdate({ email }, { isPremium, premiumExpiresAt: expiryDate }).exec();
  }
}

export const userRepository = new UserRepository();
