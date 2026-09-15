const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `comm_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  postId: {
    type: String
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    default: 'Farmer'
  },
  district: {
    type: String
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { _id: false });

const communityPostSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `post_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required'],
    index: true
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorRole: {
    type: String,
    default: 'Lead Cultivator & Farm Owner'
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Crop Disease',
      'Pest Problem',
      'Weather Alert',
      'Irrigation & Water',
      'Seeds & Fertilizer',
      'Market Prices',
      'Farming Tips',
      'General Discussion'
    ],
    default: 'General Discussion',
    index: true
  },
  cropTag: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

module.exports = CommunityPost;
