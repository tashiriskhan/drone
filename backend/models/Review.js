import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function(productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratings: parseFloat(stats[0].avgRating.toFixed(1)),
            numReviews: stats[0].count
        });
    }
};

reviewSchema.post('save', async function() {
    await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await this.constructor.calcAverageRating(doc.product);
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;