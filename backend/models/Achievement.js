const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String,  // URL for the achievement image (uploaded via Cloudinary/Multer)
    default: "" 
  },
  count: { 
    type: Number,  // e.g., "5000 meals served", "1000 children educated"
    required: true 
  },
  category: { 
    type: String,  // e.g., "Education", "Healthcare", "Community"
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);