/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car, MapPin, DollarSign, Calendar, Clock, Plus, Compass, Users, UserCheck } from 'lucide-react';
import { Driver, Passenger, Trip, Order } from '../types';

interface NewDispatchModalProps {
  drivers: Driver[];
  passengers?: Passenger[];
  trips?: Trip[];
  onClose: () => void;
  onDispatch: (newTrip: Omit<Trip, 'id' | 'status'>) => void;
  onAddOrder?: (newOrder: Omit<Order, 'id' | 'status'>) => void;
}

export default function NewDispatchModal({
  drivers,
  passengers = [],
  trips = [],
  onClose,
  onDispatch,
  onAddOrder,
}: NewDispatchModalProps) {
  const [adType, setAdType] = useState<'driver' | 'passenger'>('driver');

  // Driver Form States
  const [driverId, setDriverId] = useState('');
  const [routeStart, setRouteStart] = useState('Urganch');
  const [routeEnd, setRouteEnd] = useState('Xiva');
  const [emptySeats, setEmptySeats] = useState(4);
  const [price, setPrice] = useState(120000);
  const [departureDay, setDepartureDay] = useState('Bugun');
  const [departureTime, setDepartureTime] = useState('18:30');

  // Passenger Form States
  const [passengerId, setPassengerId] = useState('');
  const [targetTripId, setTargetTripId] = useState('');
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [passengerDateTime, setPassengerDateTime] = useState('Bugun, 18:45');

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDriver = drivers.find((d) => d.id === driverId);
    if (!selectedDriver) return;

    onDispatch({
      driverId: selectedDriver.id,
      driverName: selectedDriver.name,
      vehicleModel: selectedDriver.vehicleModel.split(' ').slice(1).join(' ') || selectedDriver.vehicleModel,
      licensePlate: selectedDriver.licensePlate,
      driverPhoto: selectedDriver.photoUrl,
      routeStart,
      routeEnd,
      emptySeats,
      price,
      departureDay,
      departureTime,
    });
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddOrder) return;

    const selectedPassenger = passengers.find((p) => p.id === passengerId);
    if (!selectedPassenger) return;

    const selectedTrip = trips.find((t) => t.id === targetTripId);
    if (!selectedTrip) return;

    onAddOrder({
      passengerName: selectedPassenger.name,
      passengerPhone: selectedPassenger.phone,
      passengerInitials: selectedPassenger.initials,
      tripId: selectedTrip.id,
      seatsRequested,
      dateTime: passengerDateTime,
    });
  };

  const activeTrips = trips.filter((t) => t.status === 'ACTIVE');

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {adType === 'driver' ? (
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            ) : (
              <Users className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-display-lg text-base font-bold text-on-surface">Yangi e'lon joylashtirish</h3>
            <p className="text-[11px] text-on-surface-variant font-medium">Haydovchi qatnovi yoki yo'lovchi buyurtma so'rovini tizimga kiritish</p>
          </div>
        </div>

        {/* Segmented Controller (Tabs) */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 mb-5 select-none">
          <button
            type="button"
            onClick={() => setAdType('driver')}
            className={`py-2 text-center rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adType === 'driver'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Haydovchi e'loni
          </button>
          <button
            type="button"
            onClick={() => setAdType('passenger')}
            className={`py-2 text-center rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              adType === 'passenger'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Yo'lovchi e'loni
          </button>
        </div>

        {/* Conditional Forms */}
        {adType === 'driver' ? (
          <form onSubmit={handleDriverSubmit} className="space-y-4 text-xs font-body-md">
            {/* Driver Selection dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Haydovchini tayinlash
              </label>
              <select
                required
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">Faol haydovchini tanlang...</option>
                {drivers
                  .filter((d) => d.status === 'Active')
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleModel} • {d.licensePlate})
                    </option>
                  ))}
              </select>
            </div>

            {/* Route nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Jo'nash joyi (Boshlanishi)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={routeStart}
                    onChange={(e) => setRouteStart(e.target.value)}
                    placeholder="masalan: Urganch, Xiva, Shovot"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Boradigan manzil (Yakuniy)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={routeEnd}
                    onChange={(e) => setRouteEnd(e.target.value)}
                    placeholder="masalan: Toshkent, Buxoro, Nukus"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Passenger seat configuration & base price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Bo'sh joylar soni
                </label>
                <select
                  value={emptySeats}
                  onChange={(e) => setEmptySeats(parseInt(e.target.value, 10))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 ta bo'sh joy</option>
                  <option value={2}>2 ta bo'sh joy</option>
                  <option value={3}>3 ta bo'sh joy</option>
                  <option value={4}>4 ta bo'sh joy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Asosiy narx (UZS)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="number"
                    required
                    min={1000}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Schedule departure settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Jo'nash kuni
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={departureDay}
                    onChange={(e) => setDepartureDay(e.target.value)}
                    placeholder="masalan: Bugun, Ertaga, 24-oktabr"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Jo'nash vaqti
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="masalan: 22:45"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-outline-variant/30 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-highest/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow-lg shadow-primary/25 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Qatnovni boshlash</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePassengerSubmit} className="space-y-4 text-xs font-body-md">
            {/* Passenger Selection dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Yo'lovchini tanlash
              </label>
              <select
                required
                value={passengerId}
                onChange={(e) => setPassengerId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">Faol yo'lovchini tanlang...</option>
                {passengers
                  .filter((p) => p.status === 'Active')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone})
                    </option>
                  ))}
              </select>
            </div>

            {/* Active Driver Trip Selection */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Haydovchi e'lonini (Qatnovni) tanlash
              </label>
              <select
                required
                value={targetTripId}
                onChange={(e) => setTargetTripId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">Faol haydovchi e'lonini tanlang...</option>
                {activeTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.id} • {t.driverName} ({t.routeStart} → {t.routeEnd}) • {t.departureDay} {t.departureTime}
                  </option>
                ))}
              </select>
            </div>

            {/* Requested seats & date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  So'ralayotgan o'rinlar soni
                </label>
                <select
                  value={seatsRequested}
                  onChange={(e) => setSeatsRequested(parseInt(e.target.value, 10))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 kishi</option>
                  <option value={2}>2 kishi</option>
                  <option value={3}>3 kishi</option>
                  <option value={4}>4 kishi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Sana va Vaqt
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    required
                    value={passengerDateTime}
                    onChange={(e) => setPassengerDateTime(e.target.value)}
                    placeholder="masalan: Bugun, 18:45"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-outline-variant/30 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-highest/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow-lg shadow-secondary/25 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Buyurtmani joylashtirish</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
