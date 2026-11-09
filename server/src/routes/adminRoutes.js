import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadImages } from '../controllers/uploadController.js';
import {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listOrders,
  getAdminOrder,
  updateOrderStatus,
  updatePaymentStatus,
  listCustomers,
  getCustomer,
  getAnalytics,
} from '../controllers/adminController.js';
import {
  adminListCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  adminListBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/catalogController.js';
import { getAdminSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);

router.get('/products', listAdminProducts);
router.post('/products', createProduct);
router.get('/products/:id', getAdminProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', listOrders);
router.get('/orders/:id', getAdminOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/payment', updatePaymentStatus);

router.get('/customers', listCustomers);
router.get('/customers/:id', getCustomer);

router.get('/categories', adminListCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/brands', adminListBrands);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

router.get('/settings', getAdminSettings);
router.put('/settings', updateSettings);

router.post('/upload', upload.array('images', 8), uploadImages);

export default router;
