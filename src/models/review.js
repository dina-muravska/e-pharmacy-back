import { Schema, model, Types } from 'mongoose';
export const reviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    productID: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    storeID: { type: Types.ObjectId, ref: 'Store' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true },
);

reviewSchema.index(
  { userId: 1, productId: 1 },
  {
    unique: true,
    name: 'uniq_user_product',
    partialFilterExpression: {
      userId: { $type: 'objectId' },
      productId: { $type: 'objectId' },
    },
  },
);

export const Review = model('Review', reviewSchema);
