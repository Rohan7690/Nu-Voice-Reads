import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { userRepository } from '../repositories/UserRepository';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
  
  // Razorpay sends signature in this header
  const signature = req.headers['x-razorpay-signature'] as string;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature === expectedSignature) {
    const event = req.body.event;
    
    // Check for payment captured or order paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const email = req.body.payload.payment.entity.notes.email;
      if (email) {
        await userRepository.updatePremiumStatus(email, true);
        console.log(`✅ User ${email} upgraded to Premium via Razorpay`);
      }
    }
    res.status(200).json({ status: 'ok' });
  } else {
    console.error('❌ Razorpay Webhook signature mismatch');
    res.status(400).json({ error: 'Invalid signature' });
  }
});

export default router;
