import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import customBuildRoutes from './routes/customBuild.js';
import newsletterRoutes from './routes/newsletter.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import reviewRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import couponRoutes from './routes/coupons.js';
import paymentRoutes from './routes/payment.js';
import { protect, admin } from './middleware/auth.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Newsletter from './models/Newsletter.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL;
if (!allowedOrigins && process.env.NODE_ENV === 'production') {
    console.error('ERROR: FRONTEND_URL must be set in production!');
    process.exit(1);
}
app.use(cors({
    origin: allowedOrigins || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many attempts. Please try again later.' }
});

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour per IP
    message: { success: false, message: 'Too many password reset attempts. Please try again later.' }
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Rate limit exceeded' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-build', customBuildRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'InGraviton API is running' });
});

app.get('/api/admin/stats', protect, admin, async (req, res) => {
    try {
        const [userCount, productCount, orderCount, subscriberCount] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Newsletter.countDocuments({ subscribed: true })
        ]);

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        // Monthly sales for last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlySales = await Order.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            { $group: {
                _id: { $month: '$createdAt', $year: { $year: '$createdAt' } },
                revenue: { $sum: '$total' },
                orders: { $sum: 1 }
            }},
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { status: { $nin: ['cancelled'] } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // Order status breakdown
        const orderStatusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        // Low stock products
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .sort({ stock: 1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                users: userCount,
                products: productCount,
                orders: orderCount,
                subscribers: subscriberCount,
                revenue: totalRevenue[0]?.total || 0,
                recentOrders,
                monthlySales,
                topProducts,
                orderStatusBreakdown,
                lowStockProducts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

export default app;
