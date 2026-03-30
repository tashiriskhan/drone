import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's wishlist
router.get('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('products');
        res.json({
            success: true,
            data: wishlist?.products || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlist',
            error: error.message
        });
    }
});

// Add to wishlist
router.post('/add/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        res.json({
            success: true,
            message: 'Added to wishlist',
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add to wishlist',
            error: error.message
        });
    }
});

// Remove from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        await Wishlist.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { products: productId } }
        );

        res.json({
            success: true,
            message: 'Removed from wishlist'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove from wishlist',
            error: error.message
        });
    }
});

// Clear wishlist
router.delete('/clear', protect, async (req, res) => {
    try {
        await Wishlist.findOneAndUpdate(
            { user: req.user.id },
            { $set: { products: [] } }
        );

        res.json({
            success: true,
            message: 'Wishlist cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear wishlist',
            error: error.message
        });
    }
});

export default router;
