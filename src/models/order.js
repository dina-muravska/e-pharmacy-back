import { Schema, model } from 'mongoose';

const itemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String },
    qty: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    store: { type: Schema.Types.ObjectId, ref: 'Store', default: null },
    items: {
      type: [itemSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'items required'],
      required: true,
    },
    shipping: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash On Delivery', 'Bank'],
      default: 'Cash On Delivery',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    total: { type: Number, default: 0, min: 0 },
    paymentRef: { type: String, default: null },
  },
  { timestamps: true },
);

function totalSum(items = []) {
  return items.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0),
    0,
  );
}

orderSchema.pre('save', function (next) {
  this.total = totalSum(this.items);
  next();
});

orderSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};
  const items = update.items || update.$set?.items;
  if (items) {
    const newTotal = totalSum(items);
    if (update.$set) update.$set.total = newTotal;
    else update.total = newTotal;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ store: 1, createdAt: -1 });

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Order = model('Order', orderSchema);
