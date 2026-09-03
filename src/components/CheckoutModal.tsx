import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { OrderAddress, OrderItem, ProductListing } from '../types';
import { JHARKHAND_DISTRICTS } from '../data/mockData';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  ShoppingBag,
  MapPin,
  Sparkles,
  Phone,
  User,
  Info
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutDirectProduct,
    setCheckoutDirectProduct,
    cart,
    createOrder,
    setTrackingOrderId,
    setActiveTab,
    user
  } = useFarm();

  // Address State (Jharkhand Restricted)
  const [fullName, setFullName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '+91 ');
  const [street, setStreet] = useState('Line Tank Road, Circular Area');
  const [district, setDistrict] = useState(JHARKHAND_DISTRICTS[0]); // Ranchi
  const [pincode, setPincode] = useState('834001');
  const [landmark, setLandmark] = useState('Near Albert Ekka Chowk');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'ID'>('GPAY');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardName, setCardName] = useState(user.name || 'Priya Sharma');

  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync address with current active user when switching profiles
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '+91 ');
      setCardName(user.name || 'Priya Sharma');
    }
  }, [user]);

  if (!isCheckoutModalOpen) return null;

  // Prepare Items to purchase: either single direct product or entire cart
  const itemsToOrder: OrderItem[] = checkoutDirectProduct
    ? [
        {
          productId: checkoutDirectProduct.id,
          cropName: checkoutDirectProduct.cropName,
          variety: checkoutDirectProduct.variety,
          imageUrl: checkoutDirectProduct.imageUrl,
          quantity: 1,
          unit: checkoutDirectProduct.unit,
          pricePerUnit: checkoutDirectProduct.pricePerUnit,
          subtotal: checkoutDirectProduct.pricePerUnit,
          farmerId: checkoutDirectProduct.farmerId,
          farmerName: checkoutDirectProduct.farmerName,
          farmerLocation: checkoutDirectProduct.location
        }
      ]
    : cart.map((it) => ({
        productId: it.product.id,
        cropName: it.product.cropName,
        variety: it.product.variety,
        imageUrl: it.product.imageUrl,
        quantity: it.quantity,
        unit: it.product.unit,
        pricePerUnit: it.product.pricePerUnit,
        subtotal: it.product.pricePerUnit * it.quantity,
        farmerId: it.product.farmerId,
        farmerName: it.product.farmerName,
        farmerLocation: it.product.location
      }));

  const subtotal = itemsToOrder.reduce((acc, it) => acc + it.subtotal, 0);
  const deliveryFee = itemsToOrder.length > 0 ? 40 : 0; // ₹40 Fresh Farm Express Intra-Jharkhand Delivery
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (itemsToOrder.length === 0) {
      setErrorMsg('Your order has no items.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !street.trim()) {
      setErrorMsg('Please complete all delivery address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryAddress: OrderAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        district,
        state: 'Jharkhand',
        pincode: pincode.trim(),
        landmark: landmark.trim()
      };

      const created = await createOrder({
        customerAddress: deliveryAddress,
        paymentMethod,
        items: itemsToOrder
      });

      setIsSubmitting(false);
      setTrackingOrderId(created.id);
      setActiveTab('orders');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-lime-300 relative my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header with Security Badge */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white p-4 sm:p-6 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-300 border border-lime-400/40 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-serif">Direct Farmer Checkout</h3>
                  <span className="text-[10px] bg-lime-400 text-emerald-950 font-bold px-2 py-0.2 rounded-full uppercase tracking-wider">
                    Jharkhand Scope
                  </span>
                </div>
                <p className="text-xs text-emerald-200">Doorstep delivery straight from local harvest plots</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setCheckoutDirectProduct(null);
              }}
              className="w-8 h-8 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Sandbox Demo Notice Banner - Requirement 4 */}
          <div className="mt-4 bg-lime-400/15 border border-lime-300/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-lime-200">
            <Info className="w-4 h-4 text-lime-300 shrink-0" />
            <span>
              <strong>Demo / Sandbox Payment Mode:</strong> Transactions simulate real gateway verification without debiting real bank funds. Ready for Razorpay gateway integration.
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-xs flex-1">
          
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Order Summary */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                Harvest Order Items ({itemsToOrder.length})
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">Direct Cultivator Dispatch</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {itemsToOrder.map((it) => (
                <div key={it.productId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={it.imageUrl}
                      alt={it.cropName}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-stone-900 truncate">{it.cropName}</p>
                      <p className="text-[10px] text-stone-500 truncate">
                        Farmer: {it.farmerName} • {it.farmerLocation}, JH
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-stone-600 text-[11px]">{it.quantity} {it.unit} × ₹{it.pricePerUnit} = </span>
                    <strong className="text-emerald-950 font-bold">₹{it.subtotal}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Produce Subtotal:</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Jharkhand Fresh-Transit Logistics:</span>
                <span className="font-mono">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-emerald-950 pt-1 border-t border-stone-200">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-base text-emerald-800">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address (Jharkhand Scope Restricted) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Delivery Address (Jharkhand Only)</span>
              </h4>
              <span className="text-[10px] text-stone-400 font-mono">Restricted to 24 JH Districts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Customer Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98351 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Street Address, Colony, Landmark *</label>
              <input
                type="text"
                required
                placeholder="House / Flat No., Road / Street, Landmark"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Jharkhand District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 bg-lime-50/70 border border-lime-300 rounded-xl font-bold text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  {JHARKHAND_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  disabled
                  value="Jharkhand"
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-xl font-bold text-stone-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pin Code *</label>
                <input
                  type="text"
                  required
                  placeholder="834001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* 3. Secure Payment UI (UPI, Card, NetBanking, COD) */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Select Payment Method</span>
              </h4>
              <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-lime-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                <span>Instant UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'bg-lime-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === 'NETBANKING'
                    ? 'bg-lime-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'bg-lime-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Sub-panels for selected payment option */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-700">Choose App or VPA:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['GPAY', 'PHONEPE', 'PAYTM', 'ID'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app as any)}
                        className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition cursor-pointer text-center ${
                          selectedUpiApp === app
                            ? 'bg-emerald-800 text-white border-emerald-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-lime-50'
                        }`}
                      >
                        {app === 'GPAY' ? 'Google Pay' : app === 'PHONEPE' ? 'PhonePe' : app === 'PAYTM' ? 'Paytm' : 'UPI ID'}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Enter UPI VPA ID</label>
                    <input
                      type="text"
                      placeholder="mobileNumber@upi or username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl font-mono text-xs text-center"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl font-mono text-xs text-center"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-stone-700">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold text-xs focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Bank of India (BOI)">Bank of India (BOI)</option>
                    <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="space-y-1 text-stone-600">
                  <p className="font-bold text-emerald-950">Pay upon fresh harvest delivery</p>
                  <p className="text-[11px] leading-relaxed">
                    Inspect your produce at your doorstep before paying in cash or local UPI to the courier agent.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setCheckoutDirectProduct(null);
              }}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
            >
              Back to Marketplace
            </button>

            <button
              type="submit"
              disabled={isSubmitting || itemsToOrder.length === 0}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Confirming Direct Dispatch...' : `Authorize & Pay ₹${totalAmount}`}</span>
              <ArrowRight className="w-4 h-4 text-lime-300" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
