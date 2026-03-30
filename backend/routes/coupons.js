import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Validate coupon
router.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const userId = req.user?.id;

        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired'
            });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit reached'
            });
        }

        // Check per-user usage if user is logged in
        if (userId && coupon.usedBy.some(u => u.user.toString() === userId)) {
            return res.status(400).json({
                success: false,
                message: 'You have already used this coupon'
            });
        }

        if (subtotal < coupon.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order value is ₹${coupon.minOrderValue}`
            });
        }

        let discount = coupon.discountType === 'percentage'
            ? (subtotal * coupon.discountValue) / 100
            : coupon.discountValue;

        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }

        res.json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount: Math.round(discount),
                finalAmount: subtotal - discount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to validate coupon',
            error: error.message
        });
    }
});

// Apply coupon to order (protected)
router.post('/apply', protect, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Coupon has expired'
            });
        }

        // Check per-user usage
        if (coupon.usedBy.some(u => u.user.toString() === userId)) {
            return res.status(400).json({
                success: false,
                message: 'You have already used this coupon'
            });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit reached'
            });
        }

        // Record user usage
        coupon.usedBy.push({ user: userId, usedAt: new Date() });
        coupon.usedCount += 1;
        await coupon.save();

        res.json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to apply coupon',
            error: error.message
        });
    }
});

// Admin: Create coupon
router.post('/', protect, admin, async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Coupon created',
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create coupon',
            error: error.message
        });
    }
});

// Admin: Get all coupons
router.get('/', protect, admin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coupons',
            error: error.message
        });
    }
});

// Admin: Delete coupon
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        res.json({
            success: true,
            message: 'Coupon deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete coupon',
            error: error.message
        });
    }
});

export default router;
