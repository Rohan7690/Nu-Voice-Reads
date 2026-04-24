import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { verifyAccessToken } from '../auth';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await authService.signup(name, email, password);
    res.status(201).json({ message: 'User created successfully', user: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const { accessToken, refreshToken, user } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',
    });

    res.status(200).json({ accessToken, user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ error: 'No refresh token found' });
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(oldRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',
    });

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        await authService.logout(payload.userId);
      }
    }

    res.clearCookie('refreshToken', { path: '/' });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
