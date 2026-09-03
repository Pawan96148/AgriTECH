import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Star, MessageSquareQuote, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const {
    feedbackOrderId,
    setFeedbackOrderId,
    orders,
    addOrderReview,
    user
  } = useFarm();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [productQuality, setProductQuality] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [deliveryExperience, setDeliveryExperience] = useState<'Fast & Fresh' | 'Standard' | 'Delayed'>('Fast & Fresh');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!feedbackOrderId) return null;

  const order = orders.find((o) => o.id === feedbackOrderId);
  if (!order) return null;

  const firstItem = order.items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);
    addOrderReview(order.id, {
      orderId: order.id,
      productId: firstItem?.productId || 'general',
      customerId: user.id,
      customerName: user.name || order.customerName,
      rating,
      reviewText: reviewText.trim(),
      productQuality,
      deliveryExperience,
      imageUrl: imageUrl.trim() || undefined
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-lime-300 relative my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white p-4 sm:p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-emerald-950 text-emerald-950" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-serif">Customer Produce Review</h3>
                <p className="text-xs text-emerald-200">
                  Order #{order.id} • Direct from {order.farmerName} ({order.farmerLocation}, JH)
                </p>
              </div>
            </div>

            <button
              onClick={() => setFeedbackOrderId(null)}
              className="w-8 h-8 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* Produce item preview */}
          {firstItem && (
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={firstItem.imageUrl}
                alt={firstItem.cropName}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div>
                <p className="font-bold text-emerald-950 text-xs">{firstItem.cropName}</p>
                <p className="text-[11px] text-stone-500">
                  {order.items.length > 1 ? `and ${order.items.length - 1} more items` : `${firstItem.quantity} ${firstItem.unit} delivered fresh`}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Star Rating */}
          <div className="text-center py-2 space-y-1">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
              Overall Experience Rating *
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-700">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Freshness' : rating === 4 ? '⭐⭐⭐⭐ Very Good' : rating === 3 ? '⭐⭐⭐ Average' : 'Needs Improvement'}
            </span>
          </div>

          {/* Product Quality Radio */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">
              Produce Quality & Freshness *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Excellent', 'Good', 'Fair', 'Poor'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setProductQuality(q)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition cursor-pointer text-center ${
                    productQuality === q
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-lime-50'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Experience Radio */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">
              Jharkhand Delivery Experience *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Fast & Fresh', 'Standard', 'Delayed'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeliveryExperience(d)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition cursor-pointer text-center ${
                    deliveryExperience === d
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-lime-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Written Review & Cultivator Comments *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tell other Jharkhand customers about the flavor, aroma, packaging, and farm freshness..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Optional Photo URL */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Optional Unboxing Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFeedbackOrderId(null)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !reviewText.trim()}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Submit Rating & Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
