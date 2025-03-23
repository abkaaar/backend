const cloudinary = require("../config/cloudinary");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'images',
      allowed_formats: ['jpg', 'jpeg', 'png']
    }
  });

// Create multer middleware
const upload = multer({ storage: storage });
  
  // Export the upload middleware
module.exports = upload;