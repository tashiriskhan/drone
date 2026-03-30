import mongoose from 'mongoose';

const variantOptionSchema = new mongoose.Schema({
    value: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: String,
    image: String
});

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    options: [variantOptionSchema]
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['frames', 'components', 'tools', 'accessories']
    },
    subcategory: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    specifications: {
        type: Map,
        of: String
    },
    variants: [variantSchema],
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    sku: String,
    tags: [String],
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'specifications.brand': 1 });
productSchema.index({ sku: 1 }, { sparse: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
