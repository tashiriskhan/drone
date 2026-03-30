import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay = null;

function getRazorpay() {
    if (razorpay) return razorpay;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'your-razorpay-key-id') {
        return null;
    }

    razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });
    return razorpay;
}

export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        const rp = getRazorpay();
        if (!rp) {
            return res.status(503).json({
                success: false,
                message: 'Payment gateway not configured'
            });
        }

        // Create order with Razorpay (amount in paise)
        const order = await rp.orders.create({
            amount: Math.round(amount), // amount already in paise from frontend
            currency,
            receipt: `rcpt_${Date.now()}`
        });

        res.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            }
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create Razorpay order'
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment details'
            });
        }

        // Verify the signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed - signature mismatch'
            });
        }

        // Update order payment status
        if (orderDbId) {
            const order = await Order.findById(orderDbId);
            if (order) {
                order.paymentStatus = 'paid';
                order.paymentMethod = 'razorpay';
                await order.save();
            }
        }

        res.json({
            success: true,
            message: 'Payment verified successfully'
        });
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};