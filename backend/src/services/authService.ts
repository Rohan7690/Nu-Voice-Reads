import { userRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../auth';

export class AuthService {
  async signup(name: string, email: string, passwordRaw: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    const user = await userRepository.create({ name, email, passwordHash });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async login(email: string, passwordRaw: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload: TokenPayload = {
      userId: String(user._id),
      email: user.email,
      isPremium: user.isPremium,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.updateRefreshToken(String(user._id), refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      }
    };
  }

  async refreshTokens(oldRefreshToken: string) {
    // 1. Verify token cryptographic validity
    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) throw new Error('Invalid refresh token');

    // 2. Validate against Database (to allow revocation)
    const user = await userRepository.findById(payload.userId);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new Error('Invalid or revoked refresh token');
    }

    // 3. Issue new tokens
    const newPayload: TokenPayload = {
      userId: String(user._id),
      email: user.email,
      isPremium: user.isPremium,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await userRepository.updateRefreshToken(String(user._id), newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }
}

export const authService = new AuthService();
