// server/controllers/book.controller.js
const Book = require('../models/book.model');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../client/assets/img/books');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'book-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, callback) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!validExtensions.includes(ext)) {
      return callback(new Error('Only jpg, jpeg, and png files are allowed'));
    }
    callback(null, true);
  }
}).single('cover_image');

// Handler for file upload
exports.uploadCoverImage = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Return the path to the uploaded file, relative to the client directory
    const relativePath = '/assets/img/books/' + req.file.filename;
    res.status(200).json({ success: true, filePath: relativePath });
  });
};

// Create a new book
exports.create = async (req, res) => {
  try {
    const { title, category, price, description, cover_image, seller_id } = req.body;
    
    // Validate required fields
    if (!title || !category || !price || !cover_image || !seller_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const newBook = await Book.create({
      title,
      category,
      price,
      description,
      cover_image,
      seller_id
    });
    
    res.status(201).json({ success: true, book: newBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all books
exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get books by user ID
exports.findByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const books = await Book.findByUserId(userId);
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};