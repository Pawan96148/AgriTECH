const express = require('express');
const router = express.Router();

// In-memory persistent seed store for Jharkhand Farmer Communities
let communityPosts = [
  {
    id: 'post_bokaro_01',
    authorId: 'usr_farmer_01',
    authorName: 'Rameshwar Mahto',
    authorRole: 'Lead Cultivator & Farm Owner',
    district: 'Bokaro',
    title: 'Yellowing and concentric rings on tomato foliage — Early Blight remedy?',
    content: 'Namaskar kisan bhaiyo, in Chas block my hybrid tomato crop is showing brown concentric circular spots on lower leaves with yellow margins. After recent intermittent rains the spots are spreading upward. What copper spray or bio-fungicide should I use to stop it immediately?',
    category: 'Crop Disease',
    cropTag: 'Tomato (Himsona)',
    imageUrl: '',
    likes: 8,
    likedBy: ['usr_farmer_02', 'usr_farmer_04'],
    commentsCount: 3,
    comments: [
      {
        id: 'comm_01',
        postId: 'post_bokaro_01',
        authorId: 'usr_farmer_03',
        authorName: 'Surendra Kumar',
        authorRole: 'Farm Owner & Organic Specialist',
        district: 'Bokaro',
        content: 'Rameshwar ji, this is classic Early Blight (Alternaria solani). Immediately prune infected lower leaves. Spray Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L. In organic method, 5% Neem oil with Trichoderma harzianum soil drench works well.',
        createdAt: '2026-09-10T10:30:00.000Z'
      },
      {
        id: 'comm_02',
        postId: 'post_bokaro_01',
        authorId: 'usr_farmer_05',
        authorName: 'Anand Murmu',
        authorRole: 'Lead Cultivator',
        district: 'Bokaro',
        content: 'Avoid overhead sprinkler watering in the evening; it keeps foliage moist overnight which accelerates spore germination.',
        createdAt: '2026-09-10T12:15:00.000Z'
      },
      {
        id: 'comm_03',
        postId: 'post_bokaro_01',
        authorId: 'usr_farmer_01',
        authorName: 'Rameshwar Mahto',
        authorRole: 'Lead Cultivator & Farm Owner',
        district: 'Bokaro',
        content: 'Dhanyawad Surendra ji! Will do the Copper Oxychloride spray today itself and prune bottom 6 inches leaves.',
        createdAt: '2026-09-10T14:00:00.000Z'
      }
    ],
    createdAt: '2026-09-10T09:15:00.000Z'
  },
  {
    id: 'post_bokaro_02',
    authorId: 'usr_farmer_02',
    authorName: 'Manoj Soren',
    authorRole: 'Progressive Farmer',
    district: 'Bokaro',
    title: 'Bokaro APMC Mandi Cauliflower and Brinjal wholesale rates today',
    content: 'Today at Chas Sub-divisional Mandi: Fresh Snowball Cauliflower traded at ₹26-28/kg for Grade A. Round purple brinjal at ₹22/kg. Middlemen were offering ₹18 outside. Sell directly at Mandi yard gate #2 for fair weights and instant UPI payment.',
    category: 'Market Prices',
    cropTag: 'Cauliflower & Brinjal',
    imageUrl: '',
    likes: 14,
    likedBy: ['usr_farmer_01'],
    commentsCount: 2,
    comments: [
      {
        id: 'comm_04',
        postId: 'post_bokaro_02',
        authorId: 'usr_farmer_06',
        authorName: 'Dilip Mahato',
        authorRole: 'Farm Owner',
        district: 'Bokaro',
        content: 'Thanks for the alert Manoj ji. I was about to sell to local trader at ₹19. Taking 6 quintals to Chas Mandi directly tomorrow morning.',
        createdAt: '2026-09-11T07:45:00.000Z'
      },
      {
        id: 'comm_05',
        postId: 'post_bokaro_02',
        authorId: 'usr_farmer_02',
        authorName: 'Manoj Soren',
        authorRole: 'Progressive Farmer',
        district: 'Bokaro',
        content: 'Reach before 6:30 AM Dilip bhai, morning auctions get the best institutional buyers from Dhanbad restaurants.',
        createdAt: '2026-09-11T08:20:00.000Z'
      }
    ],
    createdAt: '2026-09-11T06:30:00.000Z'
  },
  {
    id: 'post_bokaro_03',
    authorId: 'usr_farmer_04',
    authorName: 'Birendra Hansda',
    authorRole: 'Farm Owner',
    district: 'Bokaro',
    title: 'Drip irrigation fertigation schedule for Rabi Potato crop',
    content: 'Has anyone tested soluble NPK 19:19:19 fertigation at 35 days after planting in red lateritic soil? Looking for recommended kg per acre dosage through venturi.',
    category: 'Irrigation & Water',
    cropTag: 'Potato (Kufri Jyoti)',
    imageUrl: '',
    likes: 6,
    likedBy: [],
    commentsCount: 1,
    comments: [
      {
        id: 'comm_06',
        postId: 'post_bokaro_03',
        authorId: 'usr_farmer_01',
        authorName: 'Rameshwar Mahto',
        authorRole: 'Lead Cultivator & Farm Owner',
        district: 'Bokaro',
        content: 'Use 4 kg/acre NPK 19:19:19 split into 2 fertigation runs per week. Mix with 500g humic acid for root uptake in our soil.',
        createdAt: '2026-09-11T11:10:00.000Z'
      }
    ],
    createdAt: '2026-09-11T09:40:00.000Z'
  },
  {
    id: 'post_ranchi_01',
    authorId: 'usr_ranchi_01',
    authorName: 'Kailash Oraon',
    authorRole: 'Farm Owner & Organic Producer',
    district: 'Ranchi',
    title: 'Fall Armyworm scouting alert in Kanke & Ormanjhi maize fields',
    content: 'Spotted young whorl larvae on early sown sweet corn in Ormanjhi block. Check leaf central whorls for pinholes and sawdust-like frass. Apply biological Bacillus thuringiensis (Bt kurstaki @ 2g/L) or neem extract (Azadirachtin 10,000 ppm @ 2ml/L) before 3rd instar.',
    category: 'Pest Problem',
    cropTag: 'Maize / Sweet Corn',
    imageUrl: '',
    likes: 19,
    likedBy: [],
    commentsCount: 2,
    comments: [
      {
        id: 'comm_07',
        postId: 'post_ranchi_01',
        authorId: 'usr_ranchi_02',
        authorName: 'Sunita Tirkey',
        authorRole: 'Lead Cultivator',
        district: 'Ranchi',
        content: 'Good warning Kailash ji. Installed pheromone traps in Mandar plot today. Catching 12-15 moths per trap.',
        createdAt: '2026-09-10T16:00:00.000Z'
      }
    ],
    createdAt: '2026-09-10T14:20:00.000Z'
  },
  {
    id: 'post_dhanbad_01',
    authorId: 'usr_dhanbad_01',
    authorName: 'Prakash Mahato',
    authorRole: 'Farm Owner',
    district: 'Dhanbad',
    title: 'Govt Subsidy on Solar Deep Borewell Pumps under PM-KUSUM Component B',
    content: 'Applications opened at Govindpur Block Krishi Karyalay for 3HP & 5HP DC Solar submersible pumps. Up to 80% combined state + central subsidy available for small and marginal cultivators. Documents needed: Land Khatiyan/Parcha, Aadhaar, Bank passbook copy.',
    category: 'Farming Tips',
    cropTag: 'Solar Irrigation',
    imageUrl: '',
    likes: 22,
    likedBy: [],
    commentsCount: 2,
    comments: [
      {
        id: 'comm_08',
        postId: 'post_dhanbad_01',
        authorId: 'usr_dhanbad_02',
        authorName: 'Alok Singh',
        authorRole: 'Progressive Farmer',
        district: 'Dhanbad',
        content: 'Is electricity connection NOC required if we currently use diesel pump?',
        createdAt: '2026-09-11T08:00:00.000Z'
      },
      {
        id: 'comm_09',
        postId: 'post_dhanbad_01',
        authorId: 'usr_dhanbad_01',
        authorName: 'Prakash Mahato',
        authorRole: 'Farm Owner',
        district: 'Dhanbad',
        content: 'No Alok ji! Existing diesel pump owners get top priority to convert to solar. Self-declaration affidavit is enough.',
        createdAt: '2026-09-11T09:10:00.000Z'
      }
    ],
    createdAt: '2026-09-11T07:10:00.000Z'
  }
];

// GET /api/community/posts
router.get('/posts', (req, res) => {
  try {
    const { district, category } = req.query;
    let filtered = [...communityPosts];

    if (district && district.trim()) {
      const cleanDistrict = district.trim().toLowerCase();
      // Match district flexibly (e.g., "Bokaro, Jharkhand" or "Bokaro")
      filtered = filtered.filter(p => {
        const postDist = p.district.toLowerCase();
        return cleanDistrict.includes(postDist) || postDist.includes(cleanDistrict);
      });
    }

    if (category && category.trim() && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Sort by createdAt desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      count: filtered.length,
      posts: filtered
    });
  } catch (error) {
    console.error('Fetch community posts error:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve community posts.' });
  }
});

// POST /api/community/posts
router.post('/posts', (req, res) => {
  try {
    const {
      title,
      content,
      district,
      category,
      cropTag,
      imageUrl,
      authorId,
      authorName,
      authorRole
    } = req.body;

    if (!title || !content || !district) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and district are mandatory.'
      });
    }

    const cleanDistrict = district.split(',')[0].replace(/\(.*\)/, '').trim();

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: authorId || 'usr_curr',
      authorName: authorName || 'Kisan Bandhu',
      authorRole: authorRole || 'Lead Cultivator & Farm Owner',
      district: cleanDistrict,
      title: title.trim(),
      content: content.trim(),
      category: category || 'General Discussion',
      cropTag: cropTag ? cropTag.trim() : undefined,
      imageUrl: imageUrl || '',
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    communityPosts.unshift(newPost);

    return res.status(201).json({
      success: true,
      message: 'Post created successfully in your district community.',
      post: newPost
    });
  } catch (error) {
    console.error('Create community post error:', error);
    return res.status(500).json({ success: false, error: 'Failed to publish post.' });
  }
});

// POST /api/community/posts/:id/like
router.post('/posts/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = communityPosts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    if (!post.likedBy) post.likedBy = [];

    const userKey = userId || 'anonymous_user';
    const index = post.likedBy.indexOf(userKey);

    if (index > -1) {
      // Unlike
      post.likedBy.splice(index, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(userKey);
      post.likes += 1;
    }

    return res.json({
      success: true,
      likes: post.likes,
      isLiked: post.likedBy.includes(userKey)
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update like status.' });
  }
});

// POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { content, authorId, authorName, authorRole, district } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment content cannot be empty.' });
    }

    const post = communityPosts.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    if (!post.comments) post.comments = [];

    const newComment = {
      id: `comm_${Date.now()}`,
      postId: id,
      authorId: authorId || 'usr_curr',
      authorName: authorName || 'Kisan Sathi',
      authorRole: authorRole || 'Farmer',
      district: district || post.district,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    post.commentsCount = post.comments.length;

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment: newComment,
      commentsCount: post.commentsCount
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit comment.' });
  }
});

module.exports = router;
