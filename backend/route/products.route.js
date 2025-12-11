import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controller/products.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Middleware to handle multer errors and add debugging
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    }
    console.log('Multer processed successfully. File:', req.file);
    console.log('Body after multer:', req.body);
    next();
  });
};

// Routes
router.get('/', getAllProducts);
router.post('/', handleUpload, createProduct);
router.put('/:id', handleUpload, updateProduct);
router.delete('/:id', deleteProduct);

export default router;