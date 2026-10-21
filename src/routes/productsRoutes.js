import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  listProductsSchema,
  getProductByIdSchema,
} from '../validations/productValidation.js';
import {
  getProductsList,
  getProductById,
} from '../controllers/productsController.js';

const router = Router();

router.get(
  '/products',
  celebrate({
    query: listProductsSchema.extract('query'),
  }),
  getProductsList,
);

router.get(
  '/products/:id',
  celebrate({
    params: getProductByIdSchema.extract('params'),
  }),
  getProductById,
);

export default router;
