import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12, stockFilter } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (stockFilter) {
            if (stockFilter === 'in_stock') query.stock = { $gt: 10 };
            else if (stockFilter === 'low_stock') query.stock = { $gt: 0, $lte: 10 };
            else if (stockFilter === 'out_of_stock') query.stock = 0;
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'name') sortOption = { name: 1 };
        if (sort === 'rating') sortOption = { ratings: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total,
                hasMore: skip + products.length < total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(8);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured products',
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');

        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Product.countDocuments({ category });
                return { name: category, count };
            })
        );

        res.json({
            success: true,
            data: categoriesWithCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        // Whitelist allowed fields to prevent injection
        const allowedFields = ['name', 'description', 'price', 'category', 'subcategory', 'image', 'images', 'stock', 'featured', 'specifications', 'variants', 'weight', 'dimensions', 'sku', 'tags'];
        const filteredBody = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                filteredBody[key] = req.body[key];
            }
        }

        // Validate required fields
        if (!filteredBody.name || !filteredBody.description || !filteredBody.price || !filteredBody.category || !filteredBody.image) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, description, price, category, image'
            });
        }

        // Validate category
        const validCategories = ['frames', 'components', 'tools', 'accessories'];
        if (!validCategories.includes(filteredBody.category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
            });
        }

        // Validate price is positive number
        if (typeof filteredBody.price !== 'number' || filteredBody.price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }

        const product = await Product.create(filteredBody);

        res.status(201).json({
            success: true,
            message: 'Product created',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        // Whitelist allowed fields to prevent injection
        const allowedFields = ['name', 'description', 'price', 'category', 'subcategory', 'image', 'images', 'stock', 'featured', 'specifications', 'variants', 'weight', 'dimensions', 'sku', 'tags'];
        const filteredBody = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                filteredBody[key] = req.body[key];
            }
        }

        // Validate category if provided
        if (filteredBody.category) {
            const validCategories = ['frames', 'components', 'tools', 'accessories'];
            if (!validCategories.includes(filteredBody.category)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
                });
            }
        }

        // Validate price is positive number if provided
        if (filteredBody.price !== undefined && (typeof filteredBody.price !== 'number' || filteredBody.price < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            filteredBody,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};
