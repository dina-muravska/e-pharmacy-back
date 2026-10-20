import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  listStoresSchema,
  nearestStoresSchema,
} from '../validations/storeValidation.js';
import {
  getStoresList,
  getNearestStores,
} from '../controllers/storesController.js';
const router = Router();

router.get(
  '/stores',
  celebrate({
    query: listStoresSchema.extract('query'), // витягуємо саме query частину
  }),
  getStoresList,
);
router.get(
  '/stores/nearest',
  celebrate({
    query: nearestStoresSchema.extract('query'), // витягуємо саме query частину
  }),
  getNearestStores,
);
export default router;
