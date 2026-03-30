import express from 'express';
import {
    submitRequest,
    getMyRequests,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from '../controllers/customBuildController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/:id', protect, getRequestById);

router.get('/', protect, admin, getAllRequests);
router.put('/:id', protect, admin, updateRequest);
router.delete('/:id', protect, admin, deleteRequest);

export default router;
