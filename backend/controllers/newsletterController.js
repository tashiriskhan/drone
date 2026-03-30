import Newsletter from '../models/Newsletter.js';
import { sendNewsletterConfirmation } from '../utils/sendEmail.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await Newsletter.findOne({ email: normalizedEmail });

        if (existing) {
            if (existing.subscribed) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already subscribed'
                });
            }

            existing.subscribed = true;
            existing.subscribedAt = Date.now();
            existing.unsubscribedAt = undefined;
            await existing.save();

            await sendNewsletterConfirmation(existing.email);

            return res.json({
                success: true,
                message: 'Successfully re-subscribed',
                data: existing
            });
        }

        const subscriber = await Newsletter.create({ email: normalizedEmail });

        await sendNewsletterConfirmation(subscriber.email);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed! Check your email for confirmation.',
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe',
            error: error.message
        });
    }
};

export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Newsletter.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

        subscriber.subscribed = false;
        subscriber.unsubscribedAt = Date.now();
        await subscriber.save();

        res.json({
            success: true,
            message: 'Successfully unsubscribed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe',
            error: error.message
        });
    }
};

export const getSubscribers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { includeUnsubscribed, search, status } = req.query;

        // Build query
        const query = {};

        // Filter by subscribed status if specified
        if (status === 'active') {
            query.subscribed = true;
        } else if (status === 'inactive') {
            query.subscribed = false;
        } else if (includeUnsubscribed !== 'true') {
            query.subscribed = true;
        }

        // Search by email
        if (search) {
            query.email = { $regex: search, $options: 'i' };
        }

        const [subscribers, total] = await Promise.all([
            Newsletter.find(query)
                .sort({ subscribedAt: -1 })
                .skip(skip)
                .limit(limit),
            Newsletter.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: subscribers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalSubscribers: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers',
            error: error.message
        });
    }
};

// Admin: Add subscriber manually
export const addSubscriber = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await Newsletter.findOne({ email: normalizedEmail });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists in the system'
            });
        }

        const subscriber = await Newsletter.create({
            email: normalizedEmail,
            name: name || null
        });

        res.status(201).json({
            success: true,
            message: 'Subscriber added successfully',
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add subscriber',
            error: error.message
        });
    }
};

// Admin: Update subscriber
export const updateSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, subscribed, name } = req.body;

        const subscriber = await Newsletter.findById(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            const existingWithEmail = await Newsletter.findOne({ email: normalizedEmail, _id: { $ne: id } });
            if (existingWithEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            subscriber.email = normalizedEmail;
        }

        if (typeof subscribed === 'boolean') {
            subscriber.subscribed = subscribed;
            if (subscribed) {
                subscriber.subscribedAt = new Date();
                subscriber.unsubscribedAt = undefined;
            } else {
                subscriber.unsubscribedAt = new Date();
            }
        }

        if (name !== undefined) subscriber.name = name;

        await subscriber.save();

        res.json({
            success: true,
            message: 'Subscriber updated successfully',
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update subscriber',
            error: error.message
        });
    }
};

// Admin: Delete subscriber
export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        const subscriber = await Newsletter.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.json({
            success: true,
            message: 'Subscriber deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber',
            error: error.message
        });
    }
};

// Admin: Toggle subscription status
export const toggleSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscriber = await Newsletter.findById(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        subscriber.subscribed = !subscriber.subscribed;
        if (subscriber.subscribed) {
            subscriber.subscribedAt = new Date();
            subscriber.unsubscribedAt = undefined;
        } else {
            subscriber.unsubscribedAt = new Date();
        }

        await subscriber.save();

        res.json({
            success: true,
            message: subscriber.subscribed ? 'Subscriber reactivated' : 'Subscriber unsubscribed',
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle subscription',
            error: error.message
        });
    }
};
