import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';

export const getCartItems = async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ userID: userId }).populate('items.priductID');

  if (!cart) {
    cart = await Cart.create({ userID: userId, items: [] });
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully fetched cart items!',
    data: cart,
  });
};

export const updateCart = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  const formattedItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        priductID: item.productId,
        qty: item.qty,
        priceAtAdd: product ? product.price : 0,
      };
    }),
  );

  const cart = await Cart.findOneAndUpdate(
    { userID: userId },
    { items: formattedItems },
    { new: true, upsert: true },
  ).populate('items.priductID');

  res.status(200).json({
    status: 200,
    message: 'Cart successfully updated!',
    data: cart,
  });
};

export const checkoutCart = async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, clientTotal } = req.body;

  const cart = await Cart.findOne({ userID: userId }).populate(
    'items.priductID',
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      status: 400,
      message: 'Cart is empty',
    });
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: 200,
    message: 'Checkout processed successfully!',
    paymentMethod,
    clientTotal: clientTotal || null,
  });
};
