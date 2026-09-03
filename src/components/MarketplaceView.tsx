import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { ProductListing, QualityGrade } from '../types';
import { JHARKHAND_DISTRICTS } from '../data/mockData';
import {
  Store,
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Star,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Eye,
  X,
  MessageSquareQuote,
  Truck,
  Leaf
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    setIsCartOpen,
    setIsCheckoutModalOpen,
    setCheckoutDirectProduct,
    setActiveTab,
    user
  } = useFarm();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [activeDetailProduct, setActiveDetailProduct] = useState<ProductListing | null>(null);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});

  const isFarmer = user.role === 'FARM_OWNER' || user.role === 'TENANT_FARMER';

  // Jharkhand Districts list + outside option for testing requirement 7
  const districtOptions = ['ALL', ...JHARKHAND_DISTRICTS, 'Outside Jharkhand'];

  const isOutsideJharkhandSelected = selectedDistrict === 'Outside Jharkhand';

  const categories = [
    { id: 'ALL', label: 'All Harvests' },
    { id: 'Vegetable', label: 'Vegetables' },
    { id: 'Grain & Cereal', label: 'Grains & Cereals' },
    { id: 'Fruit', label: 'Fruits' },
    { id: 'Pulse', label: 'Pulses' },
    { id: 'Spices', label: 'Spices' }
  ];

  const filteredProducts = useMemo(() => {
    if (isOutsideJharkhandSelected) return [];

    return products.filter((prod) => {
      // District filter
      if (selectedDistrict !== 'ALL' && !prod.location.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && prod.category !== selectedCategory) {
        return false;
      }
      // Quality grade filter
      if (selectedGrade !== 'ALL' && prod.qualityGrade !== selectedGrade) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = prod.cropName.toLowerCase().includes(query);
        const matchVariety = prod.variety?.toLowerCase().includes(query) || false;
        const matchFarmer = prod.farmerName.toLowerCase().includes(query);
        const matchLocation = prod.location.toLowerCase().includes(query);
        if (!matchName && !matchVariety && !matchFarmer && !matchLocation) return false;
      }
      return true;
    });
  }, [products, selectedDistrict, selectedCategory, selectedGrade, searchQuery, isOutsideJharkhandSelected]);

  const handleQtyChange = (productId: string, delta: number, maxQty: number) => {
    const current = quantityMap[productId] || 1;
    const next = Math.max(1, Math.min(current + delta, maxQty));
    setQuantityMap((prev) => ({ ...prev, [productId]: next }));
  };

  const handleBuyNow = (product: ProductListing) => {
    const qty = quantityMap[product.id] || 1;
    setCheckoutDirectProduct(product);
    setIsCheckoutModalOpen(true);
  };

  const getStockBadge = (stockStatus: ProductListing['stockStatus'], qty: number, unit: string) => {
    if (stockStatus === 'OUT_OF_STOCK' || qty <= 0) {
      return (
        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
          Sold Out
        </span>
      );
    }
    if (stockStatus === 'LOW_STOCK' || qty < 50) {
      return (
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
          Only {qty} {unit} left
        </span>
      );
    }
    return (
      <span className="bg-lime-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-lime-300">
        In Stock ({qty} {unit})
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner: Direct Farm to Consumer • Jharkhand Scope */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lime-400/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-lime-400/40 text-lime-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-lime-400" />
              <span>Direct Farmer-to-Consumer Network • Exclusive to Jharkhand</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white tracking-tight">
              Fresh Harvest Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-normal">
              Buy vegetables, grains, and fruits straight from registered Jharkhand cultivators. Zero middlemen markups, 100% harvest transparency, direct-from-plot delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isFarmer && (
              <button
                onClick={() => setActiveTab('sell-produce')}
                className="flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold px-4 py-3 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>Sell Your Produce</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('orders')}
              className="flex items-center justify-center gap-2 bg-emerald-950/80 hover:bg-emerald-950 text-lime-200 border border-emerald-600/70 font-bold px-4 py-3 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <Truck className="w-4 h-4 text-lime-400" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-lime-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop, farmer name, variety, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Jharkhand District Selector */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <div className="relative w-full">
              <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="marketplace-district-filter"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-lime-50/50 border border-lime-300 rounded-xl text-xs font-bold text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="ALL">📍 All Jharkhand Districts (Available in Jharkhand)</option>
                {JHARKHAND_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    📍 {dist}, Jharkhand
                  </option>
                ))}
                <option value="Outside Jharkhand">⚠️ Outside Jharkhand (Check Coverage)</option>
              </select>
            </div>
          </div>

          {/* Quality Grade Selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="ALL">All Quality Grades</option>
              <option value="Organic Certified">🌿 Organic Certified</option>
              <option value="Grade A (Premium)">⭐ Grade A (Premium)</option>
              <option value="Export Quality">💎 Export Quality</option>
              <option value="Grade B (Standard)">🌾 Grade B (Standard)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-lime-50 text-stone-700 hover:text-emerald-900 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-xs text-stone-400 font-medium ml-auto hidden md:block">
            Showing <strong className="text-emerald-900">{filteredProducts.length}</strong> available listings
          </span>
        </div>
      </div>

      {/* Requirement 7: Outside Jharkhand Scope Warning */}
      {isOutsideJharkhandSelected && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-3 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 font-serif">
              Currently available only within Jharkhand.
            </h3>
            <p className="text-xs text-amber-900/80 max-w-lg mx-auto mt-1">
              AgriTech direct farm logistics are presently serving all 24 districts across Jharkhand (Ranchi, Jamshedpur, Bokaro, Dhanbad, Deoghar, Hazaribagh, etc.). Interstate routes will open in future phases.
            </p>
          </div>
          <button
            onClick={() => setSelectedDistrict('ALL')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Switch to All Jharkhand Districts
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!isOutsideJharkhandSelected && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-lime-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">No produce matching your criteria</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try clearing your search query, choosing &ldquo;All Jharkhand Districts&rdquo;, or removing category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDistrict('ALL');
                  setSelectedCategory('ALL');
                  setSelectedGrade('ALL');
                }}
                className="text-xs font-bold text-emerald-800 bg-lime-100 hover:bg-lime-200 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((prod) => {
                const qty = quantityMap[prod.id] || 1;
                const isSoldOut = prod.stockStatus === 'OUT_OF_STOCK' || prod.availableQuantity <= 0;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-lime-200 overflow-hidden shadow-xs hover:shadow-md hover:border-lime-400 transition-all flex flex-col group"
                  >
                    {/* Image Header with Badges */}
                    <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        <span className="bg-emerald-950/90 text-lime-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-lime-400/30 flex items-center gap-1 shadow-xs">
                          <Leaf className="w-3 h-3 text-lime-400" />
                          <span>{prod.qualityGrade}</span>
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        {getStockBadge(prod.stockStatus, prod.availableQuantity, prod.unit)}
                      </div>

                      {/* Bottom Image Overlay: Price & Rating */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                        <div>
                          <div className="text-xl font-extrabold tracking-tight">
                            ₹{prod.pricePerUnit}{' '}
                            <span className="text-xs font-normal text-emerald-200">/ {prod.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prod.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-stone-300">({prod.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-bold text-sm text-emerald-950 line-clamp-1 group-hover:text-emerald-800 transition">
                            {prod.cropName}
                          </h3>
                        </div>

                        {prod.variety && (
                          <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
                            Variety: {prod.variety}
                          </p>
                        )}

                        {/* Farmer & Location Info */}
                        <div className="mt-2.5 pt-2.5 border-t border-stone-100 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-stone-700">
                            <span className="font-semibold text-emerald-950 flex items-center gap-1">
                              <span>🌾 {prod.farmerName}</span>
                            </span>
                            <span className="text-[11px] bg-lime-50 text-emerald-900 px-1.5 py-0.2 rounded font-medium border border-lime-200">
                              Direct
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-stone-500">
                            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span className="truncate">{prod.farmName ? `${prod.farmName}, ` : ''}{prod.location}, Jharkhand</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-stone-400">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>Harvested: {prod.harvestDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions & Quantity Selector */}
                      <div className="pt-2 border-t border-stone-100 space-y-2">
                        {!isSoldOut ? (
                          <>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-stone-600">Qty ({prod.unit}):</span>
                              <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                                <button
                                  onClick={() => handleQtyChange(prod.id, -1, prod.availableQuantity)}
                                  className="px-2 py-1 text-stone-600 hover:text-emerald-900 cursor-pointer text-xs"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-mono font-bold text-xs text-stone-900">{qty}</span>
                                <button
                                  onClick={() => handleQtyChange(prod.id, 1, prod.availableQuantity)}
                                  className="px-2 py-1 text-stone-600 hover:text-emerald-900 cursor-pointer text-xs"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => setActiveDetailProduct(prod)}
                                className="p-1.5 text-stone-400 hover:text-emerald-800 hover:bg-lime-50 rounded-lg transition cursor-pointer ml-auto"
                                title="View details and farmer reviews"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => addToCart(prod, qty)}
                                className="w-full py-2 bg-lime-100 hover:bg-lime-200 text-emerald-950 font-bold text-xs rounded-xl border border-lime-300 transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" />
                                <span>Add to Cart</span>
                              </button>

                              <button
                                onClick={() => handleBuyNow(prod)}
                                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Buy Now</span>
                                <ArrowRight className="w-3 h-3 text-lime-300" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="w-full py-2 bg-stone-100 text-stone-400 font-semibold text-xs rounded-xl text-center">
                              Currently Sold Out
                            </div>
                            <button
                              onClick={() => setActiveDetailProduct(prod)}
                              className="w-full text-center text-[11px] text-emerald-800 hover:underline font-semibold cursor-pointer"
                            >
                              View Harvest Record & Reviews
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Floating Bottom Cart Bar when items are present */}
      {cart.length > 0 && (
        <div className="fixed bottom-18 md:bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-4">
          <div className="bg-emerald-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-lime-400/50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-extrabold text-sm shadow-inner">
                {cart.reduce((sum, it) => sum + it.quantity, 0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white">Direct Farm Cart</div>
                <div className="text-xs text-lime-300 font-mono font-bold">
                  ₹{cart.reduce((sum, it) => sum + it.product.pricePerUnit * it.quantity, 0)}{' '}
                  <span className="text-[10px] text-emerald-300/80 font-sans font-normal">(+ ₹40 delivery)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutDirectProduct(null);
                setIsCheckoutModalOpen(true);
              }}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {activeDetailProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-lime-300 my-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header Image */}
            <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
              <img
                src={activeDetailProduct.imageUrl}
                alt={activeDetailProduct.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              <button
                onClick={() => setActiveDetailProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-lime-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {activeDetailProduct.qualityGrade}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif">{activeDetailProduct.cropName}</h2>
                <p className="text-xs text-emerald-200">
                  {activeDetailProduct.variety ? `${activeDetailProduct.variety} • ` : ''}
                  Grown in {activeDetailProduct.location}, Jharkhand
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold uppercase">Price</span>
                  <p className="text-base font-extrabold text-emerald-950 font-mono">
                    ₹{activeDetailProduct.pricePerUnit} <span className="text-xs font-normal text-stone-600">/{activeDetailProduct.unit}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold uppercase">Available Stock</span>
                  <p className="text-sm font-bold text-stone-800 font-mono">
                    {activeDetailProduct.availableQuantity} {activeDetailProduct.unit}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold uppercase">Harvest Date</span>
                  <p className="text-xs font-bold text-stone-800">{activeDetailProduct.harvestDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold uppercase">Rating</span>
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{activeDetailProduct.rating.toFixed(1)} / 5.0</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">Harvest & Cultivation Details</h4>
                <p className="text-stone-700 leading-relaxed">{activeDetailProduct.description}</p>
              </div>

              {/* Cultivator Guarantee */}
              <div className="bg-lime-50 border border-lime-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified Jharkhand Cultivator Direct</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Harvested and dispatched directly by <strong>{activeDetailProduct.farmerName}</strong> from {activeDetailProduct.location}, Jharkhand. No wholesaler grading manipulation or artificial preservation gases.
                </p>
              </div>

              {/* Customer Feedback and Reviews */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                    <span>Customer Feedback & Ratings ({activeDetailProduct.reviewCount})</span>
                  </h4>
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Average: {activeDetailProduct.rating.toFixed(1)} / 5.0</span>
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-600 text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">Priya Sharma (Jamshedpur)</span>
                    <span className="flex items-center text-amber-600">★★★★★</span>
                  </div>
                  <p className="italic text-stone-700">
                    &ldquo;Arrived crisp, fresh, and bursting with natural sweetness. Knowing exactly which farmer and district this came from gives complete peace of mind.&rdquo;
                  </p>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[10px] text-emerald-900">
                    <span className="font-bold">Farmer Reply ({activeDetailProduct.farmerName}): </span>
                    <span>&ldquo;Thank you for supporting our local Jharkhand harvest! We take pride in clean, honest farming.&rdquo;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveDetailProduct(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(activeDetailProduct, 1);
                    setActiveDetailProduct(null);
                  }}
                  className="px-4 py-2 bg-lime-100 hover:bg-lime-200 text-emerald-950 font-bold text-xs rounded-xl border border-lime-300 cursor-pointer"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    handleBuyNow(activeDetailProduct);
                    setActiveDetailProduct(null);
                  }}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Buy Directly</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
