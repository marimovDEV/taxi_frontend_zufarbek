/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { User, ShieldAlert, BadgePlus, Ban, Eye, Search, Phone, UserCheck, Calendar, Smartphone } from 'lucide-react';
import { Driver, Passenger, Trip } from '../types';

interface UsersViewProps {
  drivers: Driver[];
  passengers: Passenger[];
  trips: Trip[];
  searchQuery: string;
  onBlockUser: (userType: 'driver' | 'passenger', id: string) => void;
  onUpdateBalance: (passengerId: string, newBalance: number) => void;
}

export default function UsersView({
  drivers,
  passengers,
  trips,
  searchQuery,
  onBlockUser,
  onUpdateBalance,
}: UsersViewProps) {
  const [roleFilter, setRoleFilter] = useState<'all' | 'drivers' | 'passengers'>('all');
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [balanceEditUser, setBalanceEditUser] = useState<Passenger | null>(null);
  const [newBalanceValue, setNewBalanceValue] = useState<string>('');

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return `${val.toLocaleString()} UZS`;
  };

  // Build unified user rows based on drivers and passengers
  const unifiedUsers: any[] = [
    ...drivers.map((d) => ({
      id: d.id,
      name: d.name,
      photoUrl: d.photoUrl,
      initials: d.name.split(' ').map((n) => n[0]).join(''),
      role: 'Driver',
      phone: d.phone || 'Telefon yo\'q',
      telegram: `@${d.name.toLowerCase().replace(' ', '_')}`,
      telegramId: '445212398',
      balance: d.earnings, // Earnings acts as balance or similar
      status: d.status === 'Active' ? 'Active' : 'Offline',
      joinedDate: d.registrationDate,
      device: d.device,
      totalTrips: d.tripsCompleted,
      vehicle: `${d.vehicleModel} (${d.licensePlate})`,
    })),
    ...passengers.map((p) => ({
      id: p.id,
      name: p.name,
      photoUrl: p.photoUrl,
      initials: p.initials,
      role: 'Passenger',
      phone: p.phone,
      telegram: p.telegramUsername,
      telegramId: p.telegramId,
      balance: p.balance,
      status: p.status,
      joinedDate: p.joinedDate,
      device: p.device,
      totalTrips: p.totalTrips,
      vehicle: 'N/A',
    })),
  ];

  // Filter users
  const filteredUsers = unifiedUsers.filter((user) => {
    // Role filter
    if (roleFilter === 'drivers' && user.role !== 'Driver') return false;
    if (roleFilter === 'passengers' && user.role !== 'Passenger') return false;

    // Search query
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.telegram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSearch;
  });

  const handleOpenBalanceEdit = (user: Passenger) => {
    setBalanceEditUser(user);
    setNewBalanceValue(user.balance.toString());
  };

  const handleSaveBalance = () => {
    if (balanceEditUser && newBalanceValue !== '') {
      const parsedVal = parseInt(newBalanceValue, 10);
      if (!isNaN(parsedVal)) {
        onUpdateBalance(balanceEditUser.id, parsedVal);
        setBalanceEditUser(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Tab Toggles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Foydalanuvchilarni boshqarish</h2>
          <p className="text-on-surface-variant font-body-md mt-1">
            Foydalanuvchi profillarini boshqarish, hamyon balanslarini tahrirlash va tizim rollarini audit qilish.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Barcha foydalanuvchilar
          </button>
          <button
            onClick={() => setRoleFilter('drivers')}
            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              roleFilter === 'drivers'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Haydovchilar
          </button>
          <button
            onClick={() => setRoleFilter('passengers')}
            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              roleFilter === 'passengers'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Yo'lovchilar
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Profil</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Balans / Daromad</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Ro'yxatdan o'tgan</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant/70 font-medium">
                    Mos keladigan foydalanuvchilar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/45 transition-colors group">
                    {/* User ID */}
                    <td className="px-6 py-4 font-mono font-bold text-xs text-outline">
                      #{user.id}
                    </td>

                    {/* Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-dim flex items-center justify-center shrink-0 select-none">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-sm text-primary">{user.initials}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface leading-tight group-hover:text-primary transition-colors">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                            {user.phone} • {user.telegram}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                        user.role === 'Driver'
                          ? 'bg-primary/5 text-primary border-primary/20'
                          : 'bg-indigo-500/5 text-indigo-600 border-indigo-500/20'
                      }`}>
                        {user.role === 'Driver' ? 'Haydovchi' : 'Yo\'lovchi'}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-extrabold ${user.balance < 0 ? 'text-error' : 'text-on-surface'}`}>
                          {formatCurrency(user.balance)}
                        </span>
                        {user.role === 'Passenger' && (
                          <button
                            onClick={() => handleOpenBalanceEdit(user)}
                            className="p-1 hover:bg-surface-container rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Balansni tahrirlash"
                          >
                            <BadgePlus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.status === 'Active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold border border-secondary-container/40">
                          Faol
                        </span>
                      )}
                      {user.status === 'Offline' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold border border-outline-variant/30">
                          Oflayn
                        </span>
                      )}
                      {user.status === 'Banned' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold border border-error-container/40 animate-pulse">
                          Bloklangan
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant">
                      {user.joinedDate}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                          title="Profil tafsilotlarini ko'rish"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {user.status !== 'Banned' ? (
                          <button
                            onClick={() => onBlockUser(user.role.toLowerCase() as any, user.id)}
                            className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                            title="Bloklash"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="p-2 text-error/30">
                            <Ban className="w-5 h-5 opacity-40" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Details Modal Card Overlay */}
      {selectedUser && (() => {
        const driverTrips = trips.filter(
          (t) => t.driverId === selectedUser.id || t.driverName === selectedUser.name
        );
        return (
          <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`bg-surface-container-lowest rounded-2xl ${selectedUser.role === 'Driver' ? 'max-w-lg' : 'max-w-md'} w-full border border-outline-variant shadow-2xl p-6 relative animate-in zoom-in-95 duration-200`}>
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>

              <div className="flex flex-col items-center text-center mt-2 pb-5 border-b border-outline-variant/30">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-dim mb-4 relative shadow">
                  {selectedUser.photoUrl ? (
                    <img src={selectedUser.photoUrl} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary flex items-center justify-center h-full">{selectedUser.initials}</span>
                  )}
                </div>
                <h3 className="font-display-lg text-lg font-bold text-on-surface leading-tight">{selectedUser.name}</h3>
                <p className="text-xs text-outline font-semibold mt-1">#{selectedUser.id} • {selectedUser.role === 'Driver' ? 'HAYDOVCHI' : 'YO\'LOVCHI'}</p>
              </div>

              <div className="space-y-4 py-5 font-body-md text-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Telefon raqami</p>
                    <p className="font-bold text-on-surface mt-0.5">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Telegram foydalanuvchi nomi</p>
                    <p className="font-bold text-on-surface mt-0.5">{selectedUser.telegram} ({selectedUser.telegramId})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Ro'yxatdan o'tgan sana</p>
                    <p className="font-bold text-on-surface mt-0.5">{selectedUser.joinedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Qurilma turi</p>
                    <p className="font-bold text-on-surface mt-0.5">{selectedUser.device}</p>
                  </div>
                </div>

                {selectedUser.vehicle !== 'N/A' && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-outline">airport_shuttle</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Avtomobil ma'lumotlari</p>
                      <p className="font-bold text-on-surface mt-0.5">{selectedUser.vehicle}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-outline-variant/30">
                  <div className="bg-surface-container/30 p-3 rounded-xl border border-outline-variant/20">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider leading-none">Jami qatnovlar</p>
                    <p className="font-extrabold text-lg text-primary mt-1">{selectedUser.totalTrips}</p>
                  </div>
                  <div className="bg-surface-container/30 p-3 rounded-xl border border-outline-variant/20">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider leading-none">Hisob holati</p>
                    <p className={`font-extrabold text-lg mt-1 ${selectedUser.balance < 0 ? 'text-error' : 'text-on-surface'}`}>
                      {formatCurrency(selectedUser.balance)}
                    </p>
                  </div>
                </div>

                {selectedUser.role === 'Driver' && (
                  <div className="pt-4 border-t border-outline-variant/30 space-y-2.5">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Haydovchining safarlari tarixi</p>
                    {driverTrips.length === 0 ? (
                      <p className="text-xs text-on-surface-variant/80 italic bg-surface-container/10 p-3 rounded-xl border border-outline-variant/10 text-center">Hozircha qatnovlar mavjud emas.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {driverTrips.map((dt) => (
                          <div key={dt.id} className="p-3 rounded-xl bg-surface-container/30 border border-outline-variant/20 hover:border-outline-variant/40 transition-all flex justify-between items-center text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                                <span>{dt.routeStart}</span>
                                <span className="text-primary font-normal">→</span>
                                <span>{dt.routeEnd}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                                <span>{dt.departureDay}, {dt.departureTime}</span>
                                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                                <span>{formatCurrency(dt.price)}</span>
                              </div>
                            </div>
                            <div>
                              {dt.status === 'ACTIVE' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[9px] font-extrabold border border-secondary-container/40">
                                  FAOL
                                </span>
                              )}
                              {dt.status === 'COMPLETED' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[9px] font-extrabold border border-outline-variant/30">
                                  YAKUNLANGAN
                                </span>
                              )}
                              {dt.status === 'CANCELLED' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[9px] font-extrabold border border-error-container/40">
                                  BEKOR
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-3 bg-surface-container-highest/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/20"
                >
                  Profilni yopish
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Adjust Balance Dialog Overlay */}
      {balanceEditUser && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full border border-outline-variant shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <h3 className="font-display-lg text-base font-bold text-on-surface mb-1">Yo'lovchi balansini tahrirlash</h3>
            <p className="text-xs text-on-surface-variant mb-4">Foydalanuvchi hamyonining mablag'ini o'zgartirish: <span className="font-bold text-on-surface">{balanceEditUser.name}</span>.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Hozirgi balans
                </label>
                <div className="px-4 py-3 bg-surface-container rounded-xl font-mono text-sm font-bold text-on-surface select-none border border-outline-variant/10">
                  {formatCurrency(balanceEditUser.balance)}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Yangi balans (UZS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newBalanceValue}
                    onChange={(e) => setNewBalanceValue(e.target.value)}
                    placeholder="Yangi summani kiriting"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm font-mono font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">UZS</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBalanceEditUser(null)}
                className="flex-1 py-3 bg-surface-container-highest/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveBalance}
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow cursor-pointer transition-all active:scale-[0.98]"
              >
                Balansni saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
