import express from 'express';
import multer from 'multer';
import { addFeedback, getAllFeedbacks, addComment } from '../controllers/feedbackController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Add feedback
router.post('/', verifyToken, upload.single('image'), addFeedback);

// Get all feedbacks
router.get('/', verifyToken, isAdmin, getAllFeedbacks);

// Add comment to feedback
router.post('/:id/comment', verifyToken, isAdmin, addComment);

export default router;
