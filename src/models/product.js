import mongoose, { Schema, model } from 'mongoose';

const productShema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    image: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: String },
    form: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    rxRequired: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true },
);

productShema.index({ brand: 1, price: 1 });
export const Product = model('Product', productShema);
