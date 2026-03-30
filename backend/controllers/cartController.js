import User from '../models/User.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('cart.product');

        const cartItems = user.cart.filter(item => item.product !== null);

        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                subtotal,
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get cart',
            error: error.message
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        const user = await User.findById(req.user.id);

        const existingItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        await user.populate('cart.product');

        const cartItems = user.cart.filter(item => item.product !== null);
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            message: 'Added to cart',
            data: {
                items: cartItems,
                subtotal,
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add to cart',
            error: error.message
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        const user = await User.findById(req.user.id);

        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not in cart'
            });
        }

        cartItem.quantity = quantity;
        await user.save();
        await user.populate('cart.product');

        const cartItems = user.cart.filter(item => item.product !== null);
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            message: 'Cart updated',
            data: {
                items: cartItems,
                subtotal,
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update cart',
            error: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.id);

        user.cart = user.cart.filter(
            item => item.product.toString() !== productId
        );

        await user.save();
        await user.populate('cart.product');

        const cartItems = user.cart.filter(item => item.product !== null);
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            message: 'Removed from cart',
            data: {
                items: cartItems,
                subtotal,
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove from cart',
            error: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.cart = [];
        await user.save();

        res.json({
            success: true,
            message: 'Cart cleared',
            data: {
                items: [],
                subtotal: 0,
                itemCount: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
            error: error.message
        });
    }
};
