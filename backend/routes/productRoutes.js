const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { descriptionAr: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (featured) {
      query.featured = true;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product (admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'boxImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, nameAr, price, category, description, descriptionAr, stock } = req.body;
    
    if (!req.files.image || !req.files.boxImage) {
      return res.status(400).json({ message: 'Product image and box image are required' });
    }
    
    const newProduct = new Product({
      name,
      nameAr,
      price,
      category,
      description,
      descriptionAr,
      stock: stock || 0,
      image: `/uploads/products/${req.files.image[0].filename}`,
      boxImage: `/uploads/products/${req.files.boxImage[0].filename}`
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'boxImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, nameAr, price, category, description, descriptionAr, stock, featured } = req.body;
    const updates = {
      name,
      nameAr,
      price,
      category,
      description,
      descriptionAr,
      updatedAt: Date.now()
    };
    
    if (stock !== undefined) {
      updates.stock = stock;
    }
    
    if (featured !== undefined) {
      updates.featured = featured;
    }
    
    if (req.files.image) {
      updates.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    
    if (req.files.boxImage) {
      updates.boxImage = `/uploads/products/${req.files.boxImage[0].filename}`;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;