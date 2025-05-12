const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a global middleware to transform image URLs in API responses
app.use((req, res, next) => {
  // Store the original res.json function
  const originalJson = res.json;
  
  // Create a function to convert image paths to full URLs
  const convertImagePaths = (obj) => {
    if (!obj) return obj;
    
    // If it's a Mongoose document, convert to a plain object first
    if (obj.constructor && obj.constructor.name === 'model') {
      obj = obj.toObject();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => {
        // If array item is a Mongoose document, convert to plain object
        if (item && item.constructor && item.constructor.name === 'model') {
          return convertImagePaths(item.toObject());
        }
        return convertImagePaths(item);
      });
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const newObj = { ...obj };
      for (const key in newObj) {
        if (key === 'image' || key === 'boxImage' || key === 'avatar' || key.endsWith('Image')) {
          if (typeof newObj[key] === 'string' && newObj[key].startsWith('/uploads')) {
            // Get the server base URL
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            newObj[key] = `${baseUrl}${newObj[key]}`;
          }
        } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
          newObj[key] = convertImagePaths(newObj[key]);
        }
      }
      return newObj;
    }
    
    return obj;
  };
  
  // Override res.json
  res.json = function(data) {
    // Apply conversion to the response data
    const convertedData = convertImagePaths(data);
    // Call the original json method with the converted data
    return originalJson.call(this, convertedData);
  };
  
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/perfume-store')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));