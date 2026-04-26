import { Router } from 'express';
import { checkoutController } from '../controllers/checkoutController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, checkoutController.createOrder);
router.post('/verify', authMiddleware, checkoutController.verifyPayment);

export default router;
