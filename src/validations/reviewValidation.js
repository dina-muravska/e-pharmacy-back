import Joi from 'joi';
import { objectId, page, limit } from './_common.js';

export const listCustomerReviewsSchema = {
  query: Joi.object({
    productId: objectId.required(),
    page,
    limit,
  }),
};
