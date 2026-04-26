import { Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { userRepository } from '../repositories/UserRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export const checkoutController = {
  createOrder: async (req: AuthRequest, res: Response) => {
    try {
      const options = {
        amount: 500 * 100, // Amount in paise (500 INR = 50000 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          email: req.user!.email
        }
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error: any) {
      console.error('Razorpay Order Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyPayment: async (req: AuthRequest, res: Response) => {
    try {
      const { orderId, paymentId, signature, email } = req.body;

      const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(orderId + "|" + paymentId);
      const generated_signature = hmac.digest('hex');

      if (generated_signature !== signature) {
        return res.status(400).json({ error: 'Transaction verification failed. Invalid signature.' });
      }

      await userRepository.updatePremiumStatus(email, true);

      res.status(200).json({ message: 'Premium status updated' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
