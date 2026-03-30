import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const existingReview = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            user: req.user.id,
            product: productId,
            rating,
            comment
        });

        // Update product's average rating and review count
        await Review.calcAverageRating(productId);

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name');

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: populatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Review.countDocuments({ product: productId });

        res.json({
            success: true,
            data: reviews,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalReviews: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('product', 'name image')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: populatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        // Update product's average rating and review count
        await Review.calcAverageRating(review.product);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};

export const adminDeleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await Review.findByIdAndDelete(review._id);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};