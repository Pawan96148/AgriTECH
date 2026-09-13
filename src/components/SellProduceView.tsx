import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ProductListing, ProductUnit, QualityGrade } from '../types';
import { JHARKHAND_DISTRICTS } from '../data/mockData';
import {
  Wheat,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  Package,
  Layers,
  Check,
  RefreshCw,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

const SAMPLE_PRODUCE_IMAGES = [
  { name: 'Red Hybrid Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
  { name: 'Golden Sweet Corn', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80' },
  { name: 'Snowball Cauliflower', url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80' },
  { name: 'Tender Green Peas', url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80' },
  { name: 'Allahabad Guava', url: 'https://images.unsplash.com/photo-1536511135899-73895e6382ca?w=600&auto=format&fit=crop&q=80' },
  { name: 'Aromatic Paddy Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fresh Green Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80' },
  { name: 'Hot Green & Red Chilli', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80' }
];

export const SellProduceView: React.FC = () => {
  const {
    products,
    addProductListing,
    updateProductListing,
    deleteProductListing,
    toggleStockStatus,
    crops,
    farms,
    orders,
    setActiveTab,
    user,
    isAuthenticated,
    openAuthModal,
    showToast
  } = useFarm();

  // New Listing Form State
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<ProductListing['category']>('Vegetable');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PRODUCE_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('200');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState('5');
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [pricePerUnit, setPricePerUnit] = useState('30');
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedAvailabilityDate, setExpectedAvailabilityDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(JHARKHAND_DISTRICTS[0]);
  const [farmName, setFarmName] = useState(farms[0]?.farmName || 'Ranchi Organic Acres');
  const [description, setDescription] = useState('');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Premium)');

  // Edit Listing State
  const [editingItem, setEditingItem] = useState<ProductListing | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editMinQty, setEditMinQty] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Auto-fill from harvested farm crops
  const handleAutoFillFromCrop = (cropId: string) => {
    const found = crops.find((c) => c.id === cropId);
    if (found) {
      setCropName(found.cropName);
      setVariety(found.variety || '');
      if (found.actualHarvestDate) {
        setHarvestDate(found.actualHarvestDate);
      } else if (found.expectedHarvestDate) {
        setHarvestDate(found.expectedHarvestDate);
      }
      if (found.estimatedYieldKg) {
        setAvailableQuantity(found.estimatedYieldKg.toString());
      }
      const linkedFarm = farms.find((f) => f.id === found.farmId);
      if (linkedFarm) {
        setFarmName(linkedFarm.farmName);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in with a cultivator account to publish a produce listing.');
      openAuthModal('LOGIN');
      return;
    }
    if (user.role === 'CUSTOMER') {
      showToast('Customer accounts cannot post harvest listings. Please switch to a Farmer account.');
      openAuthModal('SWITCH_ACCOUNT');
      return;
    }
    if (!cropName.trim()) return;

    const finalImage = customImageUrl.trim() || imageUrl;

    addProductListing({
      farmerId: user.id,
      farmerName: user.name || 'Jharkhand Cultivator',
      farmerPhone: user.phone || '+91 94311 55678',
      cropName: cropName.trim(),
      variety: variety.trim(),
      category,
      imageUrl: finalImage,
      availableQuantity: parseFloat(availableQuantity) || 10,
      minimumOrderQuantity: Math.max(1, parseFloat(minimumOrderQuantity) || 5),
      unit,
      pricePerUnit: parseFloat(pricePerUnit) || 20,
      harvestDate,
      expectedAvailabilityDate,
      location,
      farmName,
      description: description.trim() || `Fresh ${cropName} harvested organically in ${location}, Jharkhand. High purity and pesticide-free.`,
      qualityGrade,
      stockStatus: (parseFloat(availableQuantity) || 0) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
    });

    // Reset Form
    setCropName('');
    setVariety('');
    setDescription('');
    setCustomImageUrl('');
    setMinimumOrderQuantity('5');
  };

  const handleStartEdit = (prod: ProductListing) => {
    setEditingItem(prod);
    setEditQty(prod.availableQuantity.toString());
    setEditPrice(prod.pricePerUnit.toString());
    setEditDescription(prod.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedQty = parseFloat(editQty) || 0;
    updateProductListing(editingItem.id, {
      availableQuantity: updatedQty,
      pricePerUnit: parseFloat(editPrice) || editingItem.pricePerUnit,
      description: editDescription,
      stockStatus: updatedQty === 0 ? 'OUT_OF_STOCK' : updatedQty < 30 ? 'LOW_STOCK' : 'IN_STOCK'
    });

    setEditingItem(null);
  };

  // Farmer's own listings
  const farmerListings = products.filter(
    (p) => p.farmerId === user.id || user.role === 'FARM_OWNER'
  );

  // Incoming orders count
  const farmerOrders = orders.filter((o) => o.farmerId === user.id || user.role === 'FARM_OWNER');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-lime-100 text-emerald-800 rounded-xl">
              <Wheat className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">
              Post Harvest & Produce Sales
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            List harvested crops for direct consumer purchase across Jharkhand. Manage pricing, quantity, and stock status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-lime-400" />
            <span>Incoming Orders ({farmerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-1.5 bg-white hover:bg-lime-50 text-emerald-900 font-semibold px-3 py-2 rounded-xl border border-lime-300 shadow-xs transition text-xs cursor-pointer"
          >
            <span>View Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left (5 cols), Active Listings on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Post Harvest Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-lime-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lime-100 text-emerald-800 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4 text-emerald-800 stroke-[3]" />
              </div>
              <h2 className="text-sm font-bold text-emerald-950 font-serif">New Harvest Listing</h2>
            </div>
            <span className="text-[10px] bg-lime-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold border border-lime-300">
              Direct to Customer
            </span>
          </div>

          {/* Quick Pre-populate from Active Crops */}
          {crops.length > 0 && (
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                ⚡ Quick Auto-Fill from Plot Crop Cycle:
              </label>
              <select
                onChange={(e) => handleAutoFillFromCrop(e.target.value)}
                defaultValue=""
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="" disabled>
                  -- Select a crop to auto-populate --
                </option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cropName} ({c.stage}) - {c.estimatedYieldKg || 'Yield N/A'} kg
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
            {/* Crop & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Crop / Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Tomato"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  placeholder="e.g. Hybrid Roma / Desi"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Category & Quality Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Produce Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductListing['category'])}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Vegetable">Vegetable</option>
                  <option value="Grain & Cereal">Grain & Cereal</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Pulse">Pulse</option>
                  <option value="Cash Crop">Cash Crop</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Quality / Grade *</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Grade A (Premium)">Grade A (Premium)</option>
                  <option value="Organic Certified">Organic Certified</option>
                  <option value="Export Quality">Export Quality</option>
                  <option value="Grade B (Standard)">Grade B (Standard)</option>
                </select>
              </div>
            </div>

            {/* Quantity, Unit, Price, Min Order Qty - 2x2 on mobile, 4-col on tablet/desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div>
                <label className="block font-semibold text-stone-700 text-[11px] sm:text-xs mb-1">Available Qty *</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="250"
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 text-[11px] sm:text-xs mb-1">Min Order (Bulk) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="5"
                  value={minimumOrderQuantity}
                  onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Unit *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ProductUnit)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                  <option value="crate">crate</option>
                  <option value="bag">bag</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Price (₹ / unit) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="30"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Harvest Date & Availability Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Expected Availability Date *</label>
                <input
                  type="date"
                  required
                  value={expectedAvailabilityDate}
                  onChange={(e) => setExpectedAvailabilityDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Farm Location (Jharkhand Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Farm District (Jharkhand Only) *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-lime-50/70 border border-lime-300 rounded-xl text-xs font-bold text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}, Jharkhand
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm / Plot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ormanjhi Acres"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Produce Photo Selector */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span>Select Produce Image *</span>
                <span className="text-[10px] text-stone-400">Sample or Custom URL</span>
              </label>
              
              <div className="grid grid-cols-4 gap-2 mb-2">
                {SAMPLE_PRODUCE_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => {
                      setImageUrl(img.url);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer ${
                      imageUrl === img.url && !customImageUrl ? 'border-emerald-700 ring-2 ring-emerald-500' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    {imageUrl === img.url && !customImageUrl && (
                      <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Or paste custom image URL (https://...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-[11px] focus:bg-white focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Short Description & Quality Notes</label>
              <textarea
                rows={2}
                placeholder="Describe freshness, harvesting practices, taste, and storage instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <button
              type="submit"
              id="submit-harvest-listing-btn"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
              <span>Publish Listing to Jharkhand Marketplace</span>
            </button>
          </form>
        </div>

        {/* Farmer's Active Listings Table & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-lime-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-emerald-950 font-serif">
                  Your Active Marketplace Listings ({farmerListings.length})
                </h2>
                <p className="text-xs text-stone-500">Live inventory available to Jharkhand consumers</p>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold bg-lime-50 px-2.5 py-1 rounded-lg border border-lime-200">
                Direct Sales Active
              </span>
            </div>

            {farmerListings.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl space-y-2">
                <Package className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs font-semibold text-stone-700">No active produce listings yet</p>
                <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                  Fill out the harvest posting form on the left to start selling your crops directly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {farmerListings.map((prod) => {
                  const isSoldOut = prod.stockStatus === 'OUT_OF_STOCK' || prod.availableQuantity <= 0;
                  const linkedIncomingOrders = orders.filter(
                    (o) => o.items.some((it) => it.productId === prod.id)
                  );

                  return (
                    <div
                      key={prod.id}
                      className="p-3.5 sm:p-4 rounded-2xl border border-stone-200 hover:border-lime-400 bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={prod.imageUrl}
                          alt={prod.cropName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-xs sm:text-sm text-emerald-950 truncate">
                              {prod.cropName}
                            </h3>
                            <span className="text-[10px] bg-lime-100 text-emerald-900 px-2 py-0.2 rounded-full font-semibold">
                              {prod.qualityGrade}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                            <span className="font-extrabold text-emerald-950 font-mono">
                              ₹{prod.pricePerUnit} /{prod.unit}
                            </span>
                            <span>•</span>
                            <span className={`font-bold font-mono ${isSoldOut ? 'text-rose-600' : 'text-stone-800'}`}>
                              {prod.availableQuantity} {prod.unit} stock
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-700" />
                              <span>{prod.location}, Jharkhand</span>
                            </span>
                            <span>•</span>
                            <span>Harvest: {prod.harvestDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        {/* Sold out toggle */}
                        <button
                          onClick={() => toggleStockStatus(prod.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                            isSoldOut
                              ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleStartEdit(prod)}
                          className="p-1.5 text-stone-600 hover:text-emerald-900 hover:bg-lime-100 rounded-xl border border-stone-200 transition cursor-pointer"
                          title="Edit Quantity and Price"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteProductListing(prod.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-stone-200 transition cursor-pointer"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Orders count badge */}
                        {linkedIncomingOrders.length > 0 && (
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="bg-emerald-900 text-lime-300 text-[10px] font-bold px-2 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
                            title="View incoming orders for this product"
                          >
                            <span>{linkedIncomingOrders.length} Orders</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Listing Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 border border-lime-300 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-emerald-950 font-serif">
                  Edit Produce Listing
                </h3>
                <p className="text-xs text-stone-500">{editingItem.cropName}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer text-sm font-bold active:scale-95 -mr-1 shrink-0"
                aria-label="Close Edit Modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Available Quantity ({editingItem.unit}) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Price per {editingItem.unit} (₹) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
