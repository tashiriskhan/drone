import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    adminDeleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.get('/my-reviews', protect, getUserReviews);

router.post('/', protect, createReview);

router.put('/:id', protect, updateReview);

router.delete('/:id', protect, deleteReview);

router.delete('/admin/:id', protect, admin, adminDeleteReview);

export default router;