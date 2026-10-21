import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getCartSchema,
  updateCartSchema,
  checkoutSchema,
} from '../validations/cartValidation.js';
import {
  getCartItems,
  updateCart,
  checkoutCart,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get(
  '/cart',
  authenticate,
  celebrate({
    query: getCartSchema.extract('query'),
    params: getCartSchema.extract('params'),
    body: getCartSchema.extract('body'),
  }),
  getCartItems,
);

router.put(
  '/cart/update',
  authenticate,
  celebrate({
    body: updateCartSchema.extract('body'),
  }),
  updateCart,
);

router.post(
  '/cart/checkout',
  authenticate,
  celebrate({
    body: checkoutSchema.extract('body'),
  }),
  checkoutCart,
);
export default router;
