import mongoose from 'mongoose';

const customBuildSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    useCase: {
        type: String,
        required: [true, 'Use case is required'],
        enum: [
            'Photography & Videography',
            'Racing',
            'Agricultural Survey',
            'Industrial Inspection',
            'Search & Rescue',
            'Other'
        ]
    },
    budgetRange: {
        type: String,
        required: [true, 'Budget range is required'],
        enum: ['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+']
    },
    flightTime: {
        type: String,
        required: [true, 'Flight time is required'],
        enum: ['15-20 minutes', '20-30 minutes', '30-45 minutes', '45+ minutes']
    },
    additionalRequirements: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'quoted', 'approved', 'in_progress', 'completed', 'rejected'],
        default: 'pending'
    },
    quotedPrice: {
        type: Number
    },
    responseNotes: {
        type: String
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

customBuildSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const CustomBuild = mongoose.model('CustomBuild', customBuildSchema);

export default CustomBuild;
