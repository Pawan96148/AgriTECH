import React from 'react';
import { useFarm } from '../context/FarmContext';
import { DeliveryStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Package,
  Check,
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Navigation,
  Radio
} from 'lucide-react';

const MILESTONES_ORDER: { status: DeliveryStatus; label: string; icon: string; desc: string }[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed', icon: '📝', desc: 'Order logged & direct checkout verified' },
  { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', icon: '🌾', desc: 'Farmer confirmed morning harvest availability' },
  { status: 'PACKED', label: 'Packed at Farm', icon: '📦', desc: 'Produce inspected, graded & eco-packed' },
  { status: 'DELIVERY_BOY_ASSIGNED', label: 'Delivery Boy Assigned', icon: '🛵', desc: 'Dedicated logistics partner assigned for transit' },
  { status: 'PICKED_UP', label: 'Picked Up', icon: '🚚', desc: 'AgriTech regional logistics collected batch' },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: '🛣️', desc: 'Moving through Jharkhand fresh-transit highway' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '📍', desc: 'Courier dispatched to local delivery address' },
  { status: 'DELIVERED', label: 'Delivered', icon: '🎉', desc: 'Received fresh at customer doorstep' }
];

export const DeliveryTrackingModal: React.FC = () => {
  const {
    trackingOrderId,
    setTrackingOrderId,
    orders,
    updateOrderStatus,
    user,
    setFeedbackOrderId
  } = useFarm();

  if (!trackingOrderId) return null;

  const order = orders.find((o) => o.id === trackingOrderId);
  if (!order) return null;

  const isFarmer = user.role === 'FARM_OWNER' || user.id === order.farmerId;
  const isDeliveryPartner = user.role === 'DELIVERY_PARTNER' || user.id === order.deliveryBoyId;
  const canAdvance = isFarmer || isDeliveryPartner;

  const currentIdx = MILESTONES_ORDER.findIndex((m) => m.status === order.deliveryStatus);
  const nextMilestone = currentIdx < MILESTONES_ORDER.length - 1 ? MILESTONES_ORDER[currentIdx + 1] : null;

  const isLiveGpsActive = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.deliveryStatus);
  const isDelivered = order.deliveryStatus === 'DELIVERED';

  const handleAdvanceStatus = () => {
    if (nextMilestone) {
      updateOrderStatus(order.id, nextMilestone.status);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-lime-300 relative my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white p-4 sm:p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-serif">Live Delivery Tracking</h3>
                  <span className="text-[10px] bg-lime-400 text-emerald-950 font-mono font-bold px-2 py-0.2 rounded-full">
                    {order.id}
                  </span>
                </div>
                <p className="text-xs text-emerald-200">
                  Direct Harvest Route: {order.farmerLocation} → {order.deliveryAddress.district}, Jharkhand
                </p>
              </div>
            </div>

            <button
              onClick={() => setTrackingOrderId(null)}
              className="w-8 h-8 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Quick Route Summary Card */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase">Cultivator Origin</span>
                <p className="font-bold text-emerald-950 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{order.farmerName} • {order.farmerLocation}, JH</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase">Customer Destination</span>
                <p className="font-bold text-emerald-950 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-700 shrink-0" />
                  <span className="truncate">
                    {order.deliveryAddress.villageArea ? `${order.deliveryAddress.villageArea}, ` : ''}
                    {order.deliveryAddress.district}, JH
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between text-[11px]">
              <span className="text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Est. Delivery: <strong>{order.estimatedDeliveryDate}</strong></span>
              </span>
              <span className="text-stone-400 font-mono">Updated: {order.updatedAt}</span>
            </div>
          </div>

          {/* Delivery Partner Details Card */}
          {order.deliveryBoyName && (
            <div className="bg-lime-50/70 border border-lime-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-lime-300 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Assigned Delivery Boy
                  </span>
                  <p className="font-extrabold text-emerald-950 text-xs">{order.deliveryBoyName}</p>
                  <p className="text-[10px] text-stone-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>+91 {order.deliveryBoyPhone}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Partner
                </span>
                {order.assignedAt && (
                  <p className="text-[9px] text-stone-400 font-mono mt-0.5">Assigned {order.assignedAt}</p>
                )}
              </div>
            </div>
          )}

          {/* Real-time GPS Tracking Visualizer Card */}
          <div className="rounded-2xl border p-4 space-y-3 bg-white border-stone-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${isLiveGpsActive ? 'text-emerald-600 animate-pulse' : 'text-stone-400'}`} />
                <span className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                  Live GPS Route Tracking
                </span>
              </div>
              {isLiveGpsActive && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Active Broadcast
                </span>
              )}
              {isDelivered && (
                <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  Tracking Closed
                </span>
              )}
            </div>

            {/* GPS Visual Route Indicator */}
            {isLiveGpsActive ? (
              <div className="space-y-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>Farm ({order.farmerLocation})</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <Navigation className="w-3 h-3 text-emerald-700 animate-bounce" />
                    <span>In Transit</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-lime-700" />
                    <span>Destination ({order.deliveryAddress.district})</span>
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="relative h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-700 rounded-full transition-all duration-500"
                    style={{
                      width:
                        order.deliveryStatus === 'PICKED_UP'
                          ? '35%'
                          : order.deliveryStatus === 'IN_TRANSIT'
                          ? '65%'
                          : '90%'
                    }}
                  ></div>
                </div>

                {/* Live Coordinates Display */}
                {order.currentLocation ? (
                  <div className="pt-2 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                    <div>
                      <span className="text-stone-400 block">Latitude</span>
                      <strong className="text-emerald-950 font-bold">
                        {order.currentLocation.latitude.toFixed(5)}° N
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Longitude</span>
                      <strong className="text-emerald-950 font-bold">
                        {order.currentLocation.longitude.toFixed(5)}° E
                      </strong>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-stone-400 block">Speed & Signal</span>
                      <strong className="text-emerald-800 font-bold">
                        {order.currentLocation.speed ? `${order.currentLocation.speed} km/h` : 'Moving'} • GPS Lock
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500 italic text-center py-1">
                    Awaiting GPS coordinates broadcast from delivery partner&apos;s device...
                  </div>
                )}
              </div>
            ) : isDelivered ? (
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Delivery completed — tracking closed.</strong> Real-time browser GPS tracking deactivated to protect delivery partner privacy.
                </span>
              </div>
            ) : (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-500 text-center">
                Live GPS route tracking will automatically activate once the order is <strong>Picked Up</strong> from the farm.
              </div>
            )}
          </div>

          {/* Advance Milestone Control for Farmer or Delivery Partner */}
          {canAdvance && nextMilestone && (
            <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Logistics & Fulfillment Control
                </span>
                <p className="font-bold text-emerald-950 text-xs mt-0.5">
                  Advance order milestone to: <span className="text-emerald-800 font-mono">{nextMilestone.label}</span>
                </p>
              </div>

              <button
                onClick={handleAdvanceStatus}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
              >
                <span>Advance to {nextMilestone.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
              </button>
            </div>
          )}

          {/* If Delivered, show Rate & Review CTA for Customer */}
          {isDelivered && !order.review && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-emerald-950 text-xs">Fresh Produce Delivered!</p>
                <p className="text-[11px] text-stone-600">Rate your experience and support {order.farmerName}.</p>
              </div>
              <button
                onClick={() => {
                  setTrackingOrderId(null);
                  setFeedbackOrderId(order.id);
                }}
                className="px-3.5 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rate & Review</span>
              </button>
            </div>
          )}

          {/* Visual 8-Step Timeline */}
          <div className="space-y-4 relative pl-4 sm:pl-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {MILESTONES_ORDER.map((milestone, idx) => {
              const timelineItem = order.timeline.find((t) => t.status === milestone.status);
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={milestone.status} className="relative pl-6 group">
                  {/* Bullet indicator */}
                  <div
                    className={`absolute -left-4 sm:-left-3 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                      isCurrent
                        ? 'bg-lime-400 text-emerald-950 ring-4 ring-lime-100 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 text-stone-400 border border-stone-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Milestone Content Card */}
                  <div
                    className={`p-3 rounded-xl border transition ${
                      isCurrent
                        ? 'bg-lime-50/60 border-lime-300 shadow-xs'
                        : isCompleted
                        ? 'bg-white border-stone-200'
                        : 'bg-stone-50/60 border-stone-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{milestone.icon}</span>
                        <span className="font-bold text-xs text-stone-900">{milestone.label}</span>
                        {isCurrent && (
                          <span className="bg-lime-400 text-emerald-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                            Current Status
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">
                        {timelineItem?.timestamp || 'Pending'}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      {timelineItem?.note || milestone.desc}
                    </p>

                    {timelineItem?.location && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-medium mt-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{timelineItem.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setTrackingOrderId(null)}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Close Timeline
          </button>
        </div>

      </div>
    </div>
  );
};
