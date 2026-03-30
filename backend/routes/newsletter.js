import express from 'express';
import { subscribe, unsubscribe, getSubscribers, addSubscriber, updateSubscriber, deleteSubscriber, toggleSubscription } from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', protect, admin, getSubscribers);
router.post('/', protect, admin, addSubscriber);
router.put('/:id', protect, admin, updateSubscriber);
router.patch('/:id/toggle', protect, admin, toggleSubscription);
router.delete('/:id', protect, admin, deleteSubscriber);

export default router;
