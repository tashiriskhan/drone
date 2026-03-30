import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'testpass'
    }
});

const STATUS_TEMPLATES = {
    'pending': {
        subject: 'Order Confirmed - InGraviton',
        message: (order) => `
Dear ${order.shippingAddress.fullName},

Thank you for your order from InGraviton!

Order ID: ${order._id}
Total: ₹${order.total.toLocaleString('en-IN')}

We'll notify you when your order ships.
        `
    },
    'processing': {
        subject: 'Your Order is Being Processed - InGraviton',
        message: (order) => `
Dear ${order.shippingAddress.fullName},

Good news! Your order ${order._id} is now being processed by our team.

We'll prepare your items for shipment shortly.
        `
    },
    'shipped': {
        subject: 'Your Order Has Shipped! - InGraviton',
        message: (order) => `
Dear ${order.shippingAddress.fullName},

Your order ${order._id} has been shipped!

Tracking Number: ${order.trackingNumber || 'Pending'}
Estimated Delivery: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : '3-5 business days'}

You can track your package on our website or the carrier's site.
        `
    },
    'delivered': {
        subject: 'Your Order Has Been Delivered - InGraviton',
        message: (order) => `
Dear ${order.shippingAddress.fullName},

Your order ${order._id} has been delivered!

We hope you enjoy your new drone components. If you have any questions or concerns, please don't hesitate to reach out to our support team.

Thank you for choosing InGraviton!
        `
    },
    'cancelled': {
        subject: 'Order Cancelled - InGraviton',
        message: (order) => `
Dear ${order.shippingAddress.fullName},

Your order ${order._id} has been cancelled.

If you did not request this cancellation or have any questions, please contact our support team immediately.

Refund will be processed within 5-7 business days.
        `
    }
};

export const sendOrderStatusEmail = async (order, newStatus) => {
    try {
        const template = STATUS_TEMPLATES[newStatus];
        if (!template) {
            console.warn(`No email template for status: ${newStatus}`);
            return;
        }

        // Try to get email from populated user object, or from shippingAddress
        let email = null;
        if (order.user) {
            if (typeof order.user === 'object' && order.user.email) {
                email = order.user.email;
            }
        }
        if (!email && order.shippingAddress && order.shippingAddress.email) {
            email = order.shippingAddress.email;
        }

        if (!email) {
            console.error('Could not find user email for order notification:', order._id);
            return;
        }

        const mailOptions = {
            from: `"InGraviton" <${process.env.SMTP_FROM || 'noreply@ingraviton.com'}>`,
            to: email,
            subject: template.subject,
            text: template.message(order),
            html: template.message(order).replace(/\n/g, '<br>')
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order status email sent for order ${order._id} - Status: ${newStatus}`);
    } catch (error) {
        console.error('Failed to send order status email:', error.message);
    }
};

export const sendWelcomeEmail = async (user) => {
    try {
        const mailOptions = {
            from: `"InGraviton" <${process.env.SMTP_FROM || 'noreply@ingraviton.com'}>`,
            to: user.email,
            subject: 'Welcome to InGraviton!',
            text: `
Dear ${user.name},

Welcome to InGraviton!

Your account has been successfully created. You can now:
- Browse our premium drone components
- Track your orders
- Save items to your wishlist
- And much more!

Happy flying!
The InGraviton Team
            `,
            html: `
Dear ${user.name},<br><br>
Welcome to InGraviton!<br><br>
Your account has been successfully created. You can now:<br>
<ul>
<li>Browse our premium drone components</li>
<li>Track your orders</li>
<li>Save items to your wishlist</li>
<li>And much more!</li>
</ul>
Happy flying!<br><br>
The InGraviton Team
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('Failed to send welcome email:', error.message);
    }
};

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    try {
        const mailOptions = {
            from: `"InGraviton" <${process.env.SMTP_FROM || 'noreply@ingraviton.com'}>`,
            to: email,
            subject: 'Password Reset - InGraviton',
            text: `
Dear ${name},

You requested a password reset for your InGraviton account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email.
            `,
            html: `
Dear ${name},<br><br>
You requested a password reset for your InGraviton account.<br><br>
<a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">Reset Password</a><br><br>
This link will expire in 10 minutes.<br><br>
If you didn't request this, please ignore this email.
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Failed to send password reset email:', error.message);
    }
};

export const sendNewsletterConfirmation = async (email) => {
    try {
        const mailOptions = {
            from: `"InGraviton" <${process.env.SMTP_FROM || 'noreply@ingraviton.com'}>`,
            to: email,
            subject: 'Welcome to InGraviton Newsletter!',
            text: `
Thank you for subscribing to the InGraviton newsletter!

You'll receive updates about:
- New drone products and components
- Exclusive deals and offers
- Technical guides and tutorials
- Industry news and trends

Happy flying!
The InGraviton Team
            `,
            html: `
Thank you for subscribing to the InGraviton newsletter!<br><br>
You'll receive updates about:<br>
<ul>
<li>New drone products and components</li>
<li>Exclusive deals and offers</li>
<li>Technical guides and tutorials</li>
<li>Industry news and trends</li>
</ul>
Happy flying!<br><br>
The InGraviton Team
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Newsletter confirmation sent to ${email}`);
    } catch (error) {
        console.error('Failed to send newsletter confirmation:', error.message);
    }
};

export default transporter;