import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Order, DeliveryStatus } from '../types';
import {
  ShoppingBag,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
  ChevronRight,
  Package,
  Phone,
  Send,
  Building2,
  RefreshCw
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    cancelOrder,
    replyToOrderReview,
    setTrackingOrderId,
    setFeedbackOrderId,
    setActiveTab,
    user,
    deliveryPartners,
    assignDeliveryBoy,
    startLocationSharing,
    stopLocationSharing,
    isSharingLocation,
    activeSharingOrderId
  } = useFarm();

  // Mode: Customer ("My Orders"), Farmer ("Incoming Orders"), Dealer Network, or Delivery Partner
  const [viewMode, setViewMode] = useState<'CUSTOMER' | 'FARMER' | 'DEALER' | 'DELIVERY_PARTNER'>(() => {
    if (user.role === 'CUSTOMER') return 'CUSTOMER';
    if (user.role === 'DEALER') return 'DEALER';
    if (user.role === 'DELIVERY_PARTNER') return 'DELIVERY_PARTNER';
    return 'FARMER';
  });

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [showReplyBoxForOrder, setShowReplyBoxForOrder] = useState<string | null>(null);
  const [selectedDeliveryBoyForOrder, setSelectedDeliveryBoyForOrder] = useState<Record<string, string>>({});

  // Filter orders based on active mode
  const displayedOrders = orders.filter((o) => {
    // If Customer view: show orders made by user or sample customer
    if (viewMode === 'CUSTOMER') {
      if (user.role === 'CUSTOMER' && o.customerId !== user.id && o.customerId !== 'usr_customer_jharkhand') {
        return false;
      }
    }
    // If Farmer view: show orders destined for this farmer or all farmer orders
    if (viewMode === 'FARMER') {
      if (user.role === 'FARM_OWNER' && user.id !== o.farmerId && user.id !== 'usr_farmer_jharkhand') {
        // show all demo incoming orders for broad testing
      }
    }
    // If Delivery Partner view: show orders assigned to this partner or in delivery pipeline
    if (viewMode === 'DELIVERY_PARTNER') {
      if (user.role === 'DELIVERY_PARTNER') {
        return o.deliveryBoyId === user.id || !o.deliveryBoyId || ['PACKED', 'DELIVERY_BOY_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.deliveryStatus);
      }
      return ['PACKED', 'DELIVERY_BOY_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.deliveryStatus);
    }

    if (statusFilter !== 'ALL' && o.deliveryStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'ORDER_PLACED':
        return <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Order Placed</span>;
      case 'FARMER_ACCEPTED':
        return <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Farmer Accepted</span>;
      case 'PACKED':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Packed at Farm</span>;
      case 'DELIVERY_BOY_ASSIGNED':
        return <span className="bg-teal-100 text-teal-900 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Delivery Boy Assigned</span>;
      case 'PICKED_UP':
        return <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Picked Up</span>;
      case 'IN_TRANSIT':
        return <span className="bg-sky-100 text-sky-900 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full">In Transit (JH)</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-orange-100 text-orange-900 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-100 text-emerald-950 border border-lime-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Delivered Fresh</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleReplySubmit = (orderId: string) => {
    const text = replyInputMap[orderId]?.trim();
    if (!text) return;
    replyToOrderReview(orderId, text);
    setShowReplyBoxForOrder(null);
    setReplyInputMap((prev) => ({ ...prev, [orderId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-lime-100 text-emerald-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">
              Orders & Direct Fulfillment
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time Jharkhand order tracking, milestone progression, and customer rating management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <span>Browse Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
          </button>
        </div>
      </div>

      {/* Role / Perspective Switcher Bar */}
      <div className="bg-white rounded-2xl p-3 border border-lime-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500 mr-2 hidden md:inline col-span-2 sm:col-span-1">Viewing as:</span>
          
          <button
            onClick={() => setViewMode('CUSTOMER')}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center ${
              viewMode === 'CUSTOMER'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-lime-50 text-stone-700 hover:text-emerald-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Customer: Orders</span>
          </button>

          <button
            onClick={() => setViewMode('FARMER')}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center ${
              viewMode === 'FARMER'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-lime-50 text-stone-700 hover:text-emerald-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Farmer: Dispatch</span>
          </button>

          <button
            onClick={() => setViewMode('DEALER')}
            className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center ${
              viewMode === 'DEALER'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-950'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Dealer Network</span>
          </button>

          <button
            onClick={() => setViewMode('DELIVERY_PARTNER')}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center ${
              viewMode === 'DELIVERY_PARTNER'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-lime-50 text-stone-700 hover:text-emerald-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Delivery Partner</span>
          </button>
        </div>

        {/* Status Filter */}
        {viewMode !== 'DEALER' && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs font-semibold text-stone-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 cursor-pointer focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="FARMER_ACCEPTED">Farmer Accepted</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Dealer Network Tab View */}
      {viewMode === 'DEALER' && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-950 font-serif">
                Authorized Agro Dealer & Bulk Input Network
              </h3>
              <p className="text-xs text-stone-500">
                Dealers provide farm inputs, certified seeds, micro-irrigation kits, and machinery rental.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-2">
            <p className="font-bold">Direct Consumer Purchasing Notice:</p>
            <p className="leading-relaxed text-amber-900">
              Customers buy directly from registered Jharkhand farmers without middlemen. Dealers operate as certified supply partners providing machinery calibration, registered nursery stocks, and bulk institutional procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
              <div className="font-bold text-stone-900">Birsa Krishi Kendra (Bokaro)</div>
              <p className="text-stone-500">Drip irrigation parts, solar pumps & organic bio-fertilizer supply.</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                Active Partner
              </span>
            </div>
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
              <div className="font-bold text-stone-900">Ranchi Seed Depot</div>
              <p className="text-stone-500">Certified hybrid seeds, high-yield vegetable nurseries & soil test kits.</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                Active Partner
              </span>
            </div>
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
              <div className="font-bold text-stone-900">Chotanagpur Farm Equipment</div>
              <p className="text-stone-500">Tractor attachment rentals, power tillers & solar sprayers.</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                Active Partner
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Orders List for Customer / Farmer */}
      {viewMode !== 'DEALER' && (
        <>
          {displayedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-lime-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">No orders found in this category</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {viewMode === 'CUSTOMER'
                  ? 'You have not placed any direct farm orders yet. Visit the Marketplace to buy fresh harvest produce.'
                  : 'No incoming orders currently match the selected status filter.'}
              </p>
              {viewMode === 'CUSTOMER' && (
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Explore Jharkhand Marketplace
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedOrders.map((order) => {
                const isDelivered = order.deliveryStatus === 'DELIVERED';
                const isCancelled = order.deliveryStatus === 'CANCELLED';
                const canAccept = order.deliveryStatus === 'ORDER_PLACED';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-stone-200 hover:border-lime-300 shadow-xs transition overflow-hidden"
                  >
                    {/* Order Top Bar */}
                    <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-100 text-emerald-900 flex items-center justify-center font-bold">
                          <ShoppingBag className="w-5 h-5 text-emerald-800" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-emerald-950 font-mono">
                              #{order.id}
                            </span>
                            {getStatusBadge(order.deliveryStatus)}
                            <span className="text-[10px] bg-stone-200/80 text-stone-700 px-2 py-0.2 rounded font-semibold font-mono">
                              {order.paymentMethod} • {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Placed on {order.createdAt} • Direct Fresh Dispatch
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setTrackingOrderId(order.id)}
                          className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-lime-300" />
                          <span>Track Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Middle Details */}
                    <div className="p-4 sm:p-5 space-y-4 text-xs">
                      
                      {/* Products List */}
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                          Ordered Harvest Items
                        </div>
                        {order.items.map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={it.imageUrl}
                                alt={it.cropName}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                              />
                              <div className="truncate">
                                <span className="font-bold text-stone-900 text-xs truncate block">{it.cropName}</span>
                                <span className="text-[11px] text-stone-500">
                                  {it.quantity} {it.unit} @ ₹{it.pricePerUnit}/{it.unit}
                                </span>
                              </div>
                            </div>
                            <span className="font-extrabold text-stone-900 font-mono text-xs">
                              ₹{it.subtotal}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Info Columns: Farmer Origin, Customer Destination, Delivery Partner, Financials */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase">Cultivator Details</span>
                          <p className="font-bold text-emerald-950">{order.farmerName}</p>
                          <p className="text-[11px] text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>{order.farmerLocation}, Jharkhand</span>
                          </p>
                          {order.farmerPhone && (
                            <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{order.farmerPhone}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase">Delivery Destination</span>
                          <p className="font-bold text-emerald-950">{order.deliveryAddress.fullName}</p>
                          <p className="text-[11px] text-stone-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-lime-700 shrink-0" />
                            <span>
                              {order.deliveryAddress.street}
                              {order.deliveryAddress.villageArea ? `, ${order.deliveryAddress.villageArea}` : ''}
                              {order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                              , {order.deliveryAddress.district}, JH
                            </span>
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono">Pin: {order.deliveryAddress.pincode}</p>
                          <p className="text-[10px] text-stone-600 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>+91 {order.deliveryAddress.phone}</span>
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase">Delivery Partner</span>
                          {order.deliveryBoyName ? (
                            <div>
                              <p className="font-bold text-emerald-950 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>{order.deliveryBoyName}</span>
                              </p>
                              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                                <span>{order.deliveryBoyPhone}</span>
                              </p>
                              <span className="inline-block mt-0.5 text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-semibold">
                                Assigned
                              </span>
                            </div>
                          ) : (
                            <div className="text-stone-400 italic text-[11px]">
                              <span>Not Assigned Yet</span>
                              {order.deliveryStatus === 'PACKED' && (
                                <span className="block text-[10px] text-amber-700 font-semibold not-italic mt-0.5">
                                  Awaiting Farmer Dispatch
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 sm:text-right">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase">Total Amount</span>
                          <p className="font-extrabold text-base text-emerald-950 font-mono">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Includes ₹{order.deliveryFee} intra-Jharkhand transit fee
                          </p>
                        </div>
                      </div>

                      {/* Farmer Quick Actions (Accept / Pack / Assign Delivery Partner) */}
                      {viewMode === 'FARMER' && !isCancelled && (
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap bg-lime-50/40 p-3 rounded-2xl border border-lime-200">
                          <div className="text-xs">
                            <span className="font-bold text-emerald-950">Cultivator Fulfillment: </span>
                            <span className="text-stone-600">Current status: {order.deliveryStatus.replace(/_/g, ' ')}.</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {canAccept && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'FARMER_ACCEPTED', 'Farmer verified harvest batch')}
                                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                                >
                                  Accept Order
                                </button>
                                <button
                                  onClick={() => cancelOrder(order.id, 'Out of stock on farm')}
                                  className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-rose-700 border border-stone-200 font-semibold rounded-xl text-xs transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.deliveryStatus === 'FARMER_ACCEPTED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PACKED', 'Sanitized and eco-packed at plot')}
                                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                              >
                                Mark as Packed
                              </button>
                            )}

                            {order.deliveryStatus === 'PACKED' && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <select
                                  value={selectedDeliveryBoyForOrder[order.id] || (deliveryPartners[0]?.id || '')}
                                  onChange={(e) =>
                                    setSelectedDeliveryBoyForOrder((prev) => ({ ...prev, [order.id]: e.target.value }))
                                  }
                                  className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 cursor-pointer"
                                >
                                  {deliveryPartners.map((dp) => (
                                    <option key={dp.id} value={dp.id}>
                                      {dp.name} ({dp.phone}) - {dp.region || 'Jharkhand'}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    const chosenId = selectedDeliveryBoyForOrder[order.id] || deliveryPartners[0]?.id;
                                    const chosen = deliveryPartners.find((d) => d.id === chosenId) || deliveryPartners[0];
                                    if (chosen) {
                                      assignDeliveryBoy(order.id, chosen.id, chosen.name, chosen.phone);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-xs"
                                >
                                  <Truck className="w-3.5 h-3.5 text-lime-300" />
                                  <span>Assign Delivery Boy</span>
                                </button>
                              </div>
                            )}

                            {order.deliveryStatus === 'DELIVERY_BOY_ASSIGNED' && (
                              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-xl">
                                Assigned to {order.deliveryBoyName}. Awaiting logistics pickup.
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Delivery Partner Console (Milestone Progression & Real Browser GPS Sharing) */}
                      {(viewMode === 'DELIVERY_PARTNER' || user.role === 'DELIVERY_PARTNER') && !isCancelled && (
                        <div className="pt-3 border-t border-stone-100 bg-emerald-950 text-white p-3.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-white/10 rounded-lg text-lime-400">
                                <Truck className="w-4 h-4" />
                              </span>
                              <div>
                                <span className="font-bold text-xs text-white">Delivery Partner Operations Console</span>
                                <p className="text-[10px] text-emerald-200">
                                  Pipeline: <strong className="text-lime-300 font-mono">{order.deliveryStatus.replace(/_/g, ' ')}</strong>
                                  {order.currentLocation && (
                                    <span className="ml-2 text-lime-200 font-mono">
                                      • GPS: {order.currentLocation.latitude.toFixed(4)}, {order.currentLocation.longitude.toFixed(4)}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Live GPS Broadcast Toggle */}
                            {!isDelivered && (
                              <button
                                onClick={() => {
                                  const isBroadcastingThisOrder = isSharingLocation && activeSharingOrderId === order.id;
                                  if (isBroadcastingThisOrder) {
                                    stopLocationSharing(order.id);
                                  } else {
                                    startLocationSharing(order.id);
                                  }
                                }}
                                className={`w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                                  isSharingLocation && activeSharingOrderId === order.id
                                    ? 'bg-lime-400 text-emerald-950 hover:bg-lime-300 animate-pulse font-extrabold'
                                    : 'bg-emerald-800 hover:bg-emerald-700 text-lime-200 border border-emerald-600'
                                }`}
                              >
                                <span className={`w-2.5 h-2.5 rounded-full ${isSharingLocation && activeSharingOrderId === order.id ? 'bg-emerald-950' : 'bg-lime-400 animate-ping'}`}></span>
                                <span>{isSharingLocation && activeSharingOrderId === order.id ? 'Broadcasting Live GPS (Active)' : 'Broadcast Live GPS Location'}</span>
                              </button>
                            )}
                          </div>

                          {/* Milestone Progression Buttons */}
                          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-emerald-800/80 text-xs">
                            {order.deliveryStatus === 'DELIVERY_BOY_ASSIGNED' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'PICKED_UP', 'Picked up from cultivator farm')}
                                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                              >
                                Mark as Picked Up
                              </button>
                            )}

                            {order.deliveryStatus === 'PICKED_UP' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'IN_TRANSIT', 'Moving along Jharkhand highway route')}
                                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                              >
                                Mark In Transit
                              </button>
                            )}

                            {order.deliveryStatus === 'IN_TRANSIT' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY', 'Dispatched to customer local area')}
                                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                              >
                                Mark Out for Delivery
                              </button>
                            )}

                            {order.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'DELIVERED', 'Delivered fresh produce to customer doorstep')}
                                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                              >
                                Mark as Delivered
                              </button>
                            )}

                            {isDelivered && (
                              <span className="text-[11px] text-lime-300 font-semibold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                                <span>Order completed & delivered fresh. GPS tracking closed.</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Customer Review Section (if review exists) */}
                      {order.review && (
                        <div className="pt-3 border-t border-stone-100 space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-xs text-stone-900">
                                {order.review.customerName} rated {order.review.rating} / 5 Stars
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400">{order.review.createdAt}</span>
                          </div>

                          <p className="text-stone-700 italic text-xs leading-relaxed">
                            &ldquo;{order.review.reviewText}&rdquo;
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-medium">
                            <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                              Quality: <strong>{order.review.productQuality}</strong>
                            </span>
                            <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                              Delivery: <strong>{order.review.deliveryExperience}</strong>
                            </span>
                          </div>

                          {/* Farmer Reply Display */}
                          {order.review.farmerReply ? (
                            <div className="mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                              <span className="font-bold">Cultivator Reply ({order.review.farmerReply.farmerName}): </span>
                              <span className="italic">&ldquo;{order.review.farmerReply.text}&rdquo;</span>
                              <span className="block text-[10px] text-emerald-700 mt-0.5">
                                Replied on {order.review.farmerReply.repliedAt}
                              </span>
                            </div>
                          ) : (
                            viewMode === 'FARMER' && (
                              <div className="pt-1">
                                {showReplyBoxForOrder === order.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      rows={2}
                                      placeholder="Write a polite response to your customer..."
                                      value={replyInputMap[order.id] || ''}
                                      onChange={(e) =>
                                        setReplyInputMap((prev) => ({ ...prev, [order.id]: e.target.value }))
                                      }
                                      className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setShowReplyBoxForOrder(null)}
                                        className="px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleReplySubmit(order.id)}
                                        className="px-4 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                                      >
                                        <Send className="w-3 h-3" />
                                        <span>Post Reply</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowReplyBoxForOrder(order.id)}
                                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Reply to this Customer Review</span>
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* If Delivered & No Review yet, CTA for Customer */}
                      {viewMode === 'CUSTOMER' && isDelivered && !order.review && (
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between bg-lime-50/70 p-3 rounded-2xl border border-lime-200">
                          <div>
                            <span className="font-bold text-emerald-950 text-xs">Delivered Fresh to your door!</span>
                            <p className="text-[11px] text-stone-600">Share your rating and product quality feedback.</p>
                          </div>
                          <button
                            onClick={() => setFeedbackOrderId(order.id)}
                            className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-emerald-950" />
                            <span>Rate & Review</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};
