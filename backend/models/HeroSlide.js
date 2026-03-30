import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'DRONE SOLUTIONS'
    },
    subtitle: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    ctaText: {
        type: String,
        default: 'Shop Now'
    },
    ctaLink: {
        type: String,
        default: 'products.html'
    },
    ctaSecondaryText: {
        type: String,
        default: 'Custom Build'
    },
    ctaSecondaryLink: {
        type: String,
        default: 'custom-build.html'
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('HeroSlide', heroSlideSchema);