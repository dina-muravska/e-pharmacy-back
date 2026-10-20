import { Router } from 'express';
import { celebrate } from 'celebrate';
import { listCustomerReviewsSchema } from '../validations/storeValidation.js';
import { getCustomerReviews } from '../controllers/reviewsController.js';
const router = Router();

router.get(
  '/customer-reviews',
  celebrate(listCustomerReviewsSchema),
  getCustomerReviews,
);
export default router;
