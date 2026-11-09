import { Router } from 'express';
import { getPublicSettings, subscribe } from '../controllers/settingsController.js';

const router = Router();

router.get('/settings', getPublicSettings);
router.post('/newsletter', subscribe);

export default router;
