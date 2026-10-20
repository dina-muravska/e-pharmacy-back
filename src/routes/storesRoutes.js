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

router.get('/stores', celebrate(listStoresSchema), getStoresList);
router.get('/stores/nearest', celebrate(nearestStoresSchema), getNearestStores);
export default router;
