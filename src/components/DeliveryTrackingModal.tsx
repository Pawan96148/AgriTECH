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
  Sparkles
} from 'lucide-react';

const MILESTONES_ORDER: { status: DeliveryStatus; label: string; icon: string; desc: string }[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed', icon: '📝', desc: 'Order logged & direct checkout verified' },
  { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', icon: '🌾', desc: 'Farmer confirmed morning harvest availability' },
  { status: 'PACKED', label: 'Packed at Farm', icon: '📦', desc: 'Produce inspected, graded & eco-packed' },
  { status: 'PICKED_UP', label: 'Picked Up', icon: '🚚', desc: 'AgriTech regional logistics collected batch' },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: '🛣️', desc: 'Moving through Jharkhand fresh-transit highway' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🛵', desc: 'Courier dispatched to local delivery address' },
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
  const currentIdx = MILESTONES_ORDER.findIndex((m) => m.status === order.deliveryStatus);
  const nextMilestone = currentIdx < MILESTONES_ORDER.length - 1 ? MILESTONES_ORDER[currentIdx + 1] : null;

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
                  <h3 className="text-base font-bold text-white font-serif">Live Delivery Timeline</h3>
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
                  <span className="truncate">{order.deliveryAddress.district}, JH</span>
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

          {/* Farmer Milestone Advance Control */}
          {isFarmer && nextMilestone && (
            <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Cultivator / Logistics Action
                </span>
                <p className="font-bold text-emerald-950 text-xs mt-0.5">
                  Advance order status to: <span className="text-emerald-800 font-mono">{nextMilestone.label}</span>
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
          {order.deliveryStatus === 'DELIVERED' && !order.review && (
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

          {/* Visual 7-Step Timeline */}
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
