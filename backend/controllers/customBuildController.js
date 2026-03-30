import CustomBuild from '../models/CustomBuild.js';

export const submitRequest = async (req, res) => {
    try {
        const { useCase, budgetRange, flightTime, additionalRequirements, email } = req.body;

        const customBuild = await CustomBuild.create({
            user: req.user?.id,
            useCase,
            budgetRange,
            flightTime,
            additionalRequirements,
            email
        });

        res.status(201).json({
            success: true,
            message: 'Custom build request submitted successfully',
            data: customBuild
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit request',
            error: error.message
        });
    }
};

export const getMyRequests = async (req, res) => {
    try {
        const requests = await CustomBuild.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
            error: error.message
        });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const requests = await CustomBuild.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await CustomBuild.countDocuments(query);

        res.json({
            success: true,
            data: requests,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                total: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
            error: error.message
        });
    }
};

export const getRequestById = async (req, res) => {
    try {
        const request = await CustomBuild.findById(req.params.id)
            .populate('user', 'name email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch request',
            error: error.message
        });
    }
};

export const updateRequest = async (req, res) => {
    try {
        const { status, quotedPrice, responseNotes } = req.body;

        const request = await CustomBuild.findByIdAndUpdate(
            req.params.id,
            { status, quotedPrice, responseNotes },
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            message: 'Request updated',
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update request',
            error: error.message
        });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const request = await CustomBuild.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        await CustomBuild.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete request',
            error: error.message
        });
    }
};
