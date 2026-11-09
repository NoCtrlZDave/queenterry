import { Router } from 'express';
import {
  listProducts,
  getProduct,
  getRelatedProducts,
} from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug', getProduct);

export default router;
