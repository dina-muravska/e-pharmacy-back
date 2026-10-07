import mongoose, { Schema, model } from 'mongoose';

const itemSchema = new Schema(
  {
    priductID: {
      types: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    qty: { type: Number, min: 0, required: true },
    priceAtAdd: { type: Number, min: 0, required: true },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: [itemSchema],
  },
  { timestamps: true },
);

export const Cart = model('Cart', cartSchema);
