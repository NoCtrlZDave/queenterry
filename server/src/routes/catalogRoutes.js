import { Router } from 'express';
import { listCategories, listBrands } from '../controllers/catalogController.js';

const router = Router();

router.get('/categories', listCategories);
router.get('/brands', listBrands);

export default router;
