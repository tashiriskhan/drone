import express from 'express';
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ingraviton',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        res.json({
            success: true,
            data: {
                url: req.file.path,
                publicId: req.file.filename
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }

        const urls = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        res.json({
            success: true,
            data: urls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
});

export default router;