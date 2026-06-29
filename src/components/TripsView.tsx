/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ChevronRight, Eye, Trash2, CheckCircle2, XCircle, Mail, RotateCcw, Route, TrendingUp, ShoppingCart, UserCheck, CreditCard, Check, X, Pencil } from 'lucide-react';
import { Trip, Order, SystemStats } from '../types';

interface TripsViewProps {
  trips: Trip[];
  orders: Order[];
  stats: SystemStats;
  searchQuery: string;
  onCancelTrip: (tripId: string) => void;
  onConfirmOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
  onUpdateTripPrice: (tripId: string, newPrice: number) => void;
}

export default function TripsView({
  trips,
  orders,
  stats,
  searchQuery,
  onCancelTrip,
  onConfirmOrder,
  onRejectOrder,
  onUpdateTripPrice,
}: TripsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'trips' | 'orders'>('trips');
  const [tripStatusFilter, setTripStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PENDING' | 'NO_SEATS' | 'CONFIRMED' | 'REJECTED'>('ALL');
  const [page, setPage] = useState(1);

  // Price inline editing state
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return `${val.toLocaleString()} UZS`;
  };

  // Filter trips based on global query and status
  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.routeStart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.routeEnd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tripStatusFilter === 'ALL') return true;
    return t.status === tripStatusFilter;
  });

  // Check if an order has "Joy topilmadi"
  const isNoSeats = (o: Order) => {
    const associatedTrip = trips.find((t) => t.id === o.tripId);
    if (!associatedTrip) return true;
    return associatedTrip.emptySeats < o.seatsRequested || associatedTrip.status === 'CANCELLED';
  };

  // Filter orders based on global query and status
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.passengerPhone.includes(searchQuery) ||
      o.tripId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (orderStatusFilter === 'ALL') return true;
    if (orderStatusFilter === 'NO_SEATS') return isNoSeats(o);
    if (orderStatusFilter === 'PENDING') return o.status === 'PENDING';
    if (orderStatusFilter === 'CONFIRMED') return o.status === 'CONFIRMED';
    if (orderStatusFilter === 'REJECTED') return o.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sub Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb path */}
          <nav className="flex items-center gap-2 text-outline mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase opacity-75">Taksi parki</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-wider uppercase text-primary">Qatnovlar va Buyurtmalar</span>
          </nav>
          <h2 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Boshqaruv markazi</h2>
          <p className="text-on-surface-variant font-body-md mt-1">
            Barcha qatnovlar harakati va buyurtma so'rovlarini real vaqt rejimida boshqarish.
          </p>
        </div>

        {/* Tab Controls Switcher */}
        <div className="flex items-center bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/30 shadow-inner">
          <button
            onClick={() => {
              setActiveSubTab('trips');
              setPage(1);
            }}
            className={`px-5 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeSubTab === 'trips'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Haydovchi e'lonlari
          </button>
          <button
            onClick={() => {
              setActiveSubTab('orders');
              setPage(1);
            }}
            className={`px-5 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeSubTab === 'orders'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Yo'lovchi e'lonlari
          </button>
        </div>
      </div>

      {/* Conditional Sub View Render */}
      {activeSubTab === 'trips' ? (
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Sub filters */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-outline-variant/30 px-6 pt-5 bg-surface-container-low/20">
            <span className="text-xs font-bold text-outline uppercase tracking-wider mr-2">Saralash:</span>
            <button
              onClick={() => { setTripStatusFilter('ALL'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                tripStatusFilter === 'ALL'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Barchasi ({trips.length})
            </button>
            <button
              onClick={() => { setTripStatusFilter('ACTIVE'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                tripStatusFilter === 'ACTIVE'
                  ? 'bg-secondary/15 text-secondary border border-secondary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Faol e'lonlar ({trips.filter(t => t.status === 'ACTIVE').length})
            </button>
            <button
              onClick={() => { setTripStatusFilter('COMPLETED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                tripStatusFilter === 'COMPLETED'
                  ? 'bg-outline-variant/30 text-on-surface-variant border border-outline-variant/40'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Yakunlangan e'lonlar ({trips.filter(t => t.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => { setTripStatusFilter('CANCELLED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                tripStatusFilter === 'CANCELLED'
                  ? 'bg-error-container/30 text-error border border-error-container/40'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Bekor qilingan e'lonlar ({trips.filter(t => t.status === 'CANCELLED').length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Haydovchi</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Yo'nalish</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-center">Bo'sh joylar</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Narx</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Ketish vaqti</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Holat</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant/70 font-medium">
                      Mos keladigan faol qatnovlar topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-surface-container-low/45 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {trip.driverPhoto ? (
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
                              <img src={trip.driverPhoto} alt={trip.driverName} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none bg-primary-container/15 text-primary border border-primary-container/20">
                              {trip.driverName
                                .split(' ')
                                .filter(Boolean)
                                .map((n) => n[0]?.toUpperCase())
                                .slice(0, 2)
                                .join('') || '??'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-on-surface leading-tight">{trip.driverName}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                              {trip.vehicleModel} • {trip.licensePlate}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 select-none">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/45" />
                            <span className="text-xs font-semibold text-on-surface">{trip.routeStart}</span>
                          </div>
                          <div className="h-3 w-px bg-outline-variant/40 ml-1" />
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-semibold text-on-surface">{trip.routeEnd}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-bold ${
                            trip.emptySeats > 0
                              ? 'bg-surface-container text-primary border border-primary/10'
                              : 'bg-error-container text-error border border-error-container/40'
                          }`}
                        >
                          {trip.emptySeats}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-extrabold text-primary text-xs whitespace-nowrap">
                        {editingTripId === trip.id ? (
                          <div className="flex items-center gap-1 bg-surface-container/50 p-1 rounded-lg border border-primary/30 shadow-sm animate-in fade-in zoom-in-95 duration-150">
                            <input
                              type="number"
                              value={editingPriceValue}
                              onChange={(e) => setEditingPriceValue(e.target.value ? parseInt(e.target.value, 10) : 0)}
                              className="w-20 px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs font-mono font-bold focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onUpdateTripPrice(trip.id, editingPriceValue);
                                  setEditingTripId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingTripId(null);
                                }
                              }}
                            />
                            <span className="text-[10px] text-outline font-bold select-none pr-1">UZS</span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => {
                                  onUpdateTripPrice(trip.id, editingPriceValue);
                                  setEditingTripId(null);
                                }}
                                className="p-1 hover:bg-secondary/15 text-secondary rounded transition-colors cursor-pointer"
                                title="Saqlash"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingTripId(null)}
                                className="p-1 hover:bg-error-container/20 text-error rounded transition-colors cursor-pointer"
                                title="Bekor qilish"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              if (trip.status === 'ACTIVE') {
                                setEditingTripId(trip.id);
                                setEditingPriceValue(trip.price);
                              }
                            }}
                            className={`inline-flex items-center gap-2 group/price px-2 py-1 -mx-2 rounded-lg transition-all ${
                              trip.status === 'ACTIVE'
                                ? 'cursor-pointer hover:bg-primary/5 hover:text-primary'
                                : ''
                            }`}
                          >
                            <span>{formatCurrency(trip.price)}</span>
                            {trip.status === 'ACTIVE' && (
                              <Pencil className="w-3 h-3 text-outline opacity-0 group-hover/price:opacity-100 transition-all duration-200 transform translate-x-1 group-hover/price:translate-x-0" />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-on-surface leading-tight">{trip.departureDay}, {trip.departureTime}</p>
                        <p className={`text-[10px] font-semibold uppercase mt-0.5 ${trip.status === 'CANCELLED' ? 'text-error' : 'text-outline'}`}>
                          {trip.status === 'CANCELLED' ? 'Bekor qilingan' : 'Rejalashtirilgan'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {trip.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-extrabold border border-secondary-container/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            FAOL
                          </span>
                        )}
                        {trip.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-extrabold border border-outline-variant/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                            YAKUNLANGAN
                          </span>
                        )}
                        {trip.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-extrabold border border-error-container/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" />
                            BEKOR QILINGAN
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {trip.status === 'ACTIVE' ? (
                          <button
                            onClick={() => onCancelTrip(trip.id)}
                            className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                            title="Qatnovni bekor qilish"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        ) : trip.status === 'CANCELLED' ? (
                          <button
                            className="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                            title="Qatnovni tiklash"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                            title="Yozuvlarni ko'rish"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple table footer pagination info */}
          <div className="px-6 py-4 bg-surface-container/25 border-t border-outline-variant/40 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant font-medium">
              Haydovchi e'lonlaridan {filteredTrips.length} tasi ko'rsatilmoqda (jami: {trips.length} tadan)
            </p>
            <div className="flex items-center gap-2 select-none font-semibold">
              <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/20 cursor-pointer">
                <span className="material-symbols-outlined text-[16px] block">chevron_left</span>
              </button>
              <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-lg">1</span>
              <span className="text-xs text-outline px-1">2</span>
              <span className="text-xs text-outline px-1">3</span>
              <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/20 cursor-pointer">
                <span className="material-symbols-outlined text-[16px] block">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* Sub filters */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-outline-variant/30 px-6 pt-5 bg-surface-container-low/20">
            <span className="text-xs font-bold text-outline uppercase tracking-wider mr-2">Saralash:</span>
            <button
              onClick={() => { setOrderStatusFilter('ALL'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                orderStatusFilter === 'ALL'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Barchasi ({orders.length})
            </button>
            <button
              onClick={() => { setOrderStatusFilter('PENDING'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                orderStatusFilter === 'PENDING'
                  ? 'bg-tertiary-container/30 text-tertiary border border-tertiary-container/40'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Kutilmoqda ({orders.filter(o => o.status === 'PENDING').length})
            </button>
            <button
              onClick={() => { setOrderStatusFilter('NO_SEATS'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                orderStatusFilter === 'NO_SEATS'
                  ? 'bg-error-container/30 text-error border border-error-container/40'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Joy topilmadi ({orders.filter(isNoSeats).length})
            </button>
            <button
              onClick={() => { setOrderStatusFilter('CONFIRMED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                orderStatusFilter === 'CONFIRMED'
                  ? 'bg-secondary/15 text-secondary border border-secondary/20'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Tasdiqlangan ({orders.filter(o => o.status === 'CONFIRMED').length})
            </button>
            <button
              onClick={() => { setOrderStatusFilter('REJECTED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                orderStatusFilter === 'REJECTED'
                  ? 'bg-error-container/20 text-error border border-error-container/30'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
              }`}
            >
              Bekor qilingan ({orders.filter(o => o.status === 'REJECTED').length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Yo'lovchi</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Qatnov IDsi</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-center">So'ralgan joylar</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Sana va Vaqt</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Holat</th>
                  <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant/70 font-medium">
                      Mos keladigan kutilayotgan buyurtmalar topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/45 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                            order.passengerInitials === 'SA'
                              ? 'bg-tertiary-container/15 text-tertiary border border-tertiary-container/20'
                              : 'bg-primary-container/15 text-primary border border-primary-container/20'
                          }`}>
                            {order.passengerInitials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface leading-tight">{order.passengerName}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{order.passengerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-primary underline cursor-pointer hover:text-primary-container">
                          #{order.tripId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-xs text-on-surface">
                        {order.seatsRequested}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                        {order.dateTime}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-extrabold border border-tertiary-container/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                            KUTILMOQDA
                          </span>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-extrabold border border-secondary-container/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            TASDIQLANGAN
                          </span>
                        )}
                        {order.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-extrabold border border-error-container/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" />
                            RAD ETILGAN
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onConfirmOrder(order.id)}
                              className="p-2 text-secondary hover:bg-secondary-container/20 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                              title="Buyurtmani tasdiqlash"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onRejectOrder(order.id)}
                              className="p-2 text-error hover:bg-error-container/20 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                              title="Buyurtmani rad etish"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="p-2 text-outline hover:text-primary hover:bg-primary-container/10 rounded-xl transition-all cursor-pointer"
                            title="Yo'lovchiga xabar yozish"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Secondary Bottom Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Haydovchi e'lonlari</h4>
            <p className="text-2xl font-extrabold text-on-surface">{stats.liveTripsCount}</p>
          </div>
          <span className="p-3 bg-primary-container/10 text-primary rounded-xl">
            <Route className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Yo'lovchi e'lonlari</h4>
            <p className="text-2xl font-extrabold text-on-surface">{stats.pendingOrdersCount}</p>
          </div>
          <span className="p-3 bg-tertiary-container/10 text-tertiary rounded-xl">
            <ShoppingCart className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Joylar bandligi</h4>
            <p className="text-2xl font-extrabold text-on-surface">{stats.seatUtilization}%</p>
          </div>
          <span className="p-3 bg-secondary-container/15 text-secondary rounded-xl">
            <UserCheck className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Bugungi aylanma</h4>
            <p className="text-2xl font-extrabold text-on-surface">{(stats.volumeToday / 1000000).toFixed(1)}M <span className="text-xs font-normal text-on-surface-variant">UZS</span></p>
          </div>
          <span className="p-3 bg-surface-container text-on-surface-variant rounded-xl">
            <CreditCard className="w-5 h-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
