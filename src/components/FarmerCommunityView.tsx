import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFarm } from '../context/FarmContext';
import { CommunityCategory, CommunityPost } from '../types';
import {
  Users,
  MessageSquare,
  Heart,
  Plus,
  Filter,
  MapPin,
  Tag,
  Send,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  Share2,
  HelpCircle,
  Wheat,
  TrendingUp,
  CloudRain
} from 'lucide-react';

const CATEGORIES: { label: CommunityCategory; icon: string; color: string }[] = [
  { label: 'Crop Disease', icon: '🍂', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { label: 'Pest Problem', icon: '🐛', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Weather Alert', icon: '⛈️', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { label: 'Irrigation & Water', icon: '💧', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { label: 'Seeds & Fertilizer', icon: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { label: 'Market Prices', icon: '📈', color: 'bg-lime-100 text-lime-800 border-lime-200' },
  { label: 'Farming Tips', icon: '💡', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { label: 'General Discussion', icon: '💬', color: 'bg-stone-100 text-stone-800 border-stone-200' }
];

const JHARKHAND_DISTRICTS = [
  'Bokaro',
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'Hazaribagh',
  'Ramgarh',
  'Giridih',
  'Deoghar',
  'Palamu'
];

export const FarmerCommunityView: React.FC = () => {
  const { user, selectedFarm, showToast } = useFarm();

  // Extract farmer's home district from profile region or farm location
  const homeDistrict = useMemo(() => {
    const raw = user.region || selectedFarm?.location || 'Bokaro';
    const firstWord = raw.split(',')[0].replace(/\(.*\)/, '').trim();
    // Match against known districts
    const match = JHARKHAND_DISTRICTS.find(d => firstWord.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(firstWord.toLowerCase()));
    return match || 'Bokaro';
  }, [user.region, selectedFarm?.location]);

  const [activeDistrict, setActiveDistrict] = useState<string>(homeDistrict);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<CommunityCategory>('Crop Disease');
  const [postCropTag, setPostCropTag] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Active Expanded Comments State: Map of postId -> boolean
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // Sync active district if home district changes
  useEffect(() => {
    setActiveDistrict(homeDistrict);
  }, [homeDistrict]);

  // Fetch posts from backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      const res = await fetch(`http://localhost:5000/api/community/posts?district=${encodeURIComponent(activeDistrict)}${categoryParam}`);
      if (!res.ok) throw new Error('Failed to load community discussions');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to community forum.');
    } finally {
      setLoading(false);
    }
  }, [activeDistrict, selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle Like Toggle
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev =>
          prev.map(p => {
            if (p.id === postId) {
              const liked = data.isLiked;
              const likedBy = p.likedBy || [];
              const updatedLikedBy = liked
                ? [...likedBy, user.id]
                : likedBy.filter(id => id !== user.id);
              return {
                ...p,
                likes: data.likes,
                likedBy: updatedLikedBy
              };
            }
            return p;
          })
        );
      }
    } catch {
      showToast('Could not record vote. Please check connection.');
    }
  };

  // Toggle Comment Section
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle Comment Submission
  const handleAddComment = async (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          authorId: user.id,
          authorName: user.name,
          authorRole: user.roleTitle || 'Lead Cultivator',
          district: activeDistrict
        })
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setPosts(prev =>
          prev.map(p => {
            if (p.id === postId) {
              const currentComments = p.comments || [];
              return {
                ...p,
                comments: [...currentComments, data.comment],
                commentsCount: (p.commentsCount || 0) + 1
              };
            }
            return p;
          })
        );
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        showToast('Comment submitted to district discussion.');
      }
    } catch {
      showToast('Failed to post reply.');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showToast('Please fill in title and discussion content.');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const res = await fetch('http://localhost:5000/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle.trim(),
          content: postContent.trim(),
          district: activeDistrict,
          category: postCategory,
          cropTag: postCropTag.trim() || undefined,
          authorId: user.id,
          authorName: user.name,
          authorRole: user.roleTitle || 'Lead Cultivator & Farm Owner'
        })
      });

      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => [data.post, ...prev]);
        setIsPostModalOpen(false);
        setPostTitle('');
        setPostContent('');
        setPostCropTag('');
        showToast(`Your query was published to ${activeDistrict} Farmers Community!`);
      } else {
        showToast(data.error || 'Failed to publish post.');
      }
    } catch {
      showToast('Network error while publishing post.');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'recent';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    const found = CATEGORIES.find(c => c.label === category);
    return found ? found.color : 'bg-stone-100 text-stone-800 border-stone-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Community Header Banner */}
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-emerald-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold border border-lime-400/30">
              <Wheat className="w-3.5 h-3.5" />
              <span>Exclusive Cultivator & Farm Owner Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white flex items-center gap-3">
              <span>🌾 {activeDistrict} Farmers Community</span>
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-2xl">
              Connect with fellow certified cultivators across <strong className="text-lime-300">{activeDistrict} district</strong>. Share crop disease alerts, water management strategies, real APMC Mandi rates, and practical agronomic experiences.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                <MapPin className="w-3.5 h-3.5 text-lime-400" />
                <span>Primary Zone: <strong>{activeDistrict}, Jharkhand</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                <Users className="w-3.5 h-3.5 text-lime-400" />
                <span>Active Cultivators: <strong>140+ Registered</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Verified Peer Network</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-emerald-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Question / Post Alert</span>
            </button>
          </div>
        </div>

        {/* District Switcher Tabs */}
        <div className="mt-6 pt-4 border-t border-emerald-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-emerald-300 font-semibold shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Switch District:</span>
          </span>
          {JHARKHAND_DISTRICTS.map(dist => (
            <button
              key={dist}
              onClick={() => setActiveDistrict(dist)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeDistrict === dist
                  ? 'bg-lime-400 text-emerald-950 shadow-xs'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80 hover:text-white border border-emerald-700/40'
              }`}
            >
              {dist} {dist === homeDistrict && '📍'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white hover:bg-lime-50 text-emerald-950 border border-lime-300'
          }`}
        >
          All Discussions ({posts.length})
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.label)}
            className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === cat.label
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white hover:bg-lime-50 text-emerald-950 border border-lime-300'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Post Feed & Quick Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Post Feed (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-lime-200 p-12 text-center">
              <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-bold text-emerald-950">Loading {activeDistrict} discussions...</p>
              <p className="text-xs text-stone-500 mt-1">Retrieving latest peer alerts and advice</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-900 space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="text-sm font-bold">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-rose-200 hover:bg-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-lime-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-lime-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                🌾
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-emerald-950">No discussions yet in {activeDistrict}</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Be the first cultivator to ask a question, report a crop symptom, or share local Mandi rates with fellow farmers.
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Discussion</span>
              </button>
            </div>
          ) : (
            posts.map(post => {
              const isLiked = (post.likedBy || []).includes(user.id);
              const isExpanded = Boolean(expandedComments[post.id]);
              const commentsList = post.comments || [];

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-lime-200 shadow-2xs hover:shadow-xs transition p-5 space-y-4"
                >
                  {/* Post Header: Author & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-lime-300 font-bold flex items-center justify-center text-sm uppercase shrink-0 shadow-xs">
                        {post.authorName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-emerald-950">{post.authorName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-emerald-800 border border-lime-200">
                            {post.authorRole}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            <span>{post.district}, Jharkhand</span>
                          </span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${getCategoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-emerald-950 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Crop Tag Pill if present */}
                  {post.cropTag && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-700" />
                        <span>Referenced Crop:</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-emerald-950 font-bold text-[11px]">
                        {post.cropTag}
                      </span>
                    </div>
                  )}

                  {/* Post Actions: Like & Comment Toggle */}
                  <div className="pt-3 border-t border-lime-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likes || 0} Helpful</span>
                      </button>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-lime-50 hover:bg-lime-100 text-emerald-950 border border-lime-200 transition cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{post.commentsCount || commentsList.length} Responses</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-stone-500 hidden sm:inline">
                      District Forum • Certified Post
                    </span>
                  </div>

                  {/* Expandable Comments Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-dashed border-stone-200 space-y-3 bg-stone-50/50 p-3.5 rounded-xl">
                      <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Farmer Responses ({commentsList.length})</span>
                      </h4>

                      {commentsList.length === 0 ? (
                        <p className="text-xs text-stone-500 italic py-2">
                          No responses yet. Share your experience or advice for this farmer!
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {commentsList.map(comment => (
                            <div
                              key={comment.id}
                              className="bg-white p-3 rounded-xl border border-stone-200/80 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-emerald-950">{comment.authorName}</span>
                                  <span className="text-[10px] text-stone-500">({comment.authorRole})</span>
                                </div>
                                <span className="text-[10px] text-stone-400">{formatTimeAgo(comment.createdAt)}</span>
                              </div>
                              <p className="text-stone-700 leading-normal">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Share your agronomic advice or solution..."
                          className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingComment[post.id] || !(commentInputs[post.id] || '').trim()}
                          className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: District Agricultural Guide & Quick Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* District Krishi Node Card */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
                <Wheat className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">{activeDistrict} Agro-Climatic Zone</h3>
                <p className="text-[11px] text-stone-500">Central & Western Plateau Sub-Zone</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 space-y-1">
                <span className="font-bold text-emerald-950 block">Key Soil Characteristics:</span>
                <p className="text-[11px] text-stone-600">Red lateritic & sandy loam with low organic carbon. Requires periodic humic acid and cow dung enrichment.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 space-y-1">
                <span className="font-bold text-emerald-950 block">Major Current Crops:</span>
                <p className="text-[11px] text-stone-600">Paddy (Tand/Dhon), Hybrid Tomato, Winter Potato, Maize, and Green Peas.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 space-y-1">
                <span className="font-bold text-emerald-950 block">Local Mandi Nodes:</span>
                <p className="text-[11px] text-stone-600">Chas Sub-divisional Market Yard, Bokaro Steel City Daily Vegetable Haat, and Dhanbad APMC.</p>
              </div>
            </div>
          </div>

          {/* Guidelines for Farmers */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Community Conduct Guidelines</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Post realistic crop symptoms with precise variety names when possible.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Share verified Mandi wholesale prices to protect fellow farmers from middlemen cutbacks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Always mention chemical dosages per litre to avoid pesticide toxicity or phytotoxicity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-lime-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold font-serif">Ask Question or Post Alert</h3>
                <p className="text-xs text-emerald-200 mt-0.5">Publishing to <strong>{activeDistrict} Farmers Community</strong></p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Discussion Category *</label>
                <select
                  value={postCategory}
                  onChange={e => setPostCategory(e.target.value as CommunityCategory)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.label} value={c.label}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Topic / Question Title *</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. Leaf spot symptoms on tomato crop after rain..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Crop / Variety Tag (Optional)</label>
                <input
                  type="text"
                  value={postCropTag}
                  onChange={e => setPostCropTag(e.target.value)}
                  placeholder="e.g. Hybrid Tomato, Paddy Swarna, Kufri Potato"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Detailed Query / Information *</label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Describe your question, symptoms observed, soil conditions, or market information clearly..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPost ? 'Publishing...' : 'Publish to District Forum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
