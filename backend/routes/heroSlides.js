import express from 'express';
import HeroSlide from '../models/HeroSlide.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all active hero slides (public)
router.get('/', async (req, res) => {
    try {
        const slides = await HeroSlide.find({ active: true }).sort({ order: 1 });
        res.json({ success: true, data: slides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all hero slides including inactive (admin)
router.get('/all', protect, admin, async (req, res) => {
    try {
        const slides = await HeroSlide.find().sort({ order: 1 });
        res.json({ success: true, data: slides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create hero slide (admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { image, title, subtitle, description, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink, order, active } = req.body;

        if (!image) {
            return res.status(400).json({ success: false, message: 'Image URL is required' });
        }

        const slide = await HeroSlide.create({
            image,
            title,
            subtitle,
            description,
            ctaText,
            ctaLink,
            ctaSecondaryText,
            ctaSecondaryLink,
            order,
            active
        });
        res.status(201).json({ success: true, data: slide });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update hero slide (admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const slide = await HeroSlide.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!slide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        res.json({ success: true, data: slide });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete hero slide (admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const slide = await HeroSlide.findByIdAndDelete(req.params.id);
        if (!slide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        res.json({ success: true, message: 'Slide deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;