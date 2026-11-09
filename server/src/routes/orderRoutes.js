import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, myOrders, getOrder } from '../controllers/orderController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many order attempts. Please contact us on WhatsApp for help.' },
});

router.post('/', orderLimiter, optionalAuth, createOrder);
router.get('/my', protect, myOrders);
router.get('/:orderNumber', optionalAuth, getOrder);

export default router;
