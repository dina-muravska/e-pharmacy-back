import { Schema, model } from 'mongoose';

const storeSchema = new Schema(
  {
    name: { type: String, required: true },
    adress: { type: String },
    phone: { type: String },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

storeSchema.index({ location: '2dsphere' });
export const Store = model('Store', storeSchema);
