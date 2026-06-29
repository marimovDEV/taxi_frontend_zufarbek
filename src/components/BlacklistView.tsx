/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Trash2, Ban, RotateCcw, Search, PlusCircle, User, ShieldCheck } from 'lucide-react';
import { BlacklistUser } from '../types';

interface BlacklistViewProps {
  blacklist: BlacklistUser[];
  searchQuery: string;
  onUnblockUser: (id: string) => void;
  onAddToBlacklist: (newUser: Omit<BlacklistUser, 'id' | 'date' | 'time'>) => void;
}

export default function BlacklistView({
  blacklist,
  searchQuery,
  onUnblockUser,
  onAddToBlacklist,
}: BlacklistViewProps) {
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTelegramId, setNewTelegramId] = useState('');
  const [newTelegramUser, setNewTelegramUser] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newType, setNewType] = useState<'Doimiy' | 'Vaqtincha'>('Doimiy');
  const [newOriginalRole, setNewOriginalRole] = useState<'Driver' | 'Passenger'>('Passenger');
  const [blacklistTypeFilter, setBlacklistTypeFilter] = useState<'ALL' | 'Doimiy' | 'Vaqtincha'>('ALL');

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newReason.trim()) return;

    onAddToBlacklist({
      name: newName,
      phone: newPhone,
      telegramId: newTelegramId || Math.floor(Math.random() * 1000000000).toString(),
      telegramUsername: newTelegramUser.startsWith('@') ? newTelegramUser : `@${newTelegramUser}`,
      reason: newReason,
      type: newType,
      originalRole: newOriginalRole,
      initials: newName.split(' ').map((n) => n[0]).join(''),
    });

    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewTelegramId('');
    setNewTelegramUser('');
    setNewReason('');
    setNewType('Doimiy');
    setNewOriginalRole('Passenger');
    setIsAddModalOpen(false);
  };

  // Filter local blacklist items
  const filteredBlacklist = blacklist.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (blacklistTypeFilter === 'ALL') return true;
    return item.type === blacklistTypeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Qora ro'yxat (Bloklanganlar)</h2>
          <p className="text-on-surface-variant font-body-md mt-1">
            Platformada ishonchni ta'minlash, qoidalarni buzuvchi foydalanuvchilarni jazolash va cheklovlarni kuzatish.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-error text-on-error px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:opacity-95 shadow-lg shadow-error/20 cursor-pointer transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 animate-pulse" />
          <span>Qora Ro'yxatga Qo'shish</span>
        </button>
      </div>

      {/* Main Blocked Table list */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden animate-in fade-in duration-200">
        {/* Sub filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-outline-variant/30 px-6 pt-5 bg-surface-container-low/20">
          <span className="text-xs font-bold text-outline uppercase tracking-wider mr-2">Muddat turi:</span>
          <button
            onClick={() => setBlacklistTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              blacklistTypeFilter === 'ALL'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
            }`}
          >
            Barchasi ({blacklist.length})
          </button>
          <button
            onClick={() => setBlacklistTypeFilter('Vaqtincha')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              blacklistTypeFilter === 'Vaqtincha'
                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
            }`}
          >
            Vaqtincha ({blacklist.filter((item) => item.type === 'Vaqtincha').length})
          </button>
          <button
            onClick={() => setBlacklistTypeFilter('Doimiy')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
              blacklistTypeFilter === 'Doimiy'
                ? 'bg-error-container/30 text-error border border-error-container/40'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-transparent'
            }`}
          >
            Doimiy ({blacklist.filter((item) => item.type === 'Doimiy').length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Bloklangan hisob</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Asl roli</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Bloklash sababi</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Blok turi</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Sana va Vaqt</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredBlacklist.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant/70 font-medium">
                    Qora ro'yxatda mos yozuvlar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredBlacklist.map((item) => (
                  <tr key={item.id} className="hover:bg-error-container/5 transition-colors group">
                    {/* Blocked Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-error-container/40 bg-error-container/10 flex items-center justify-center shrink-0 select-none">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover grayscale" />
                          ) : (
                            <span className="font-bold text-sm text-error">{item.initials}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface leading-tight group-hover:text-error transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                            {item.phone} • {item.telegramUsername} ({item.telegramId})
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Original Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-surface-container text-on-surface-variant border border-outline-variant/30">
                        {item.originalRole === 'Driver' ? 'Haydovchi' : 'Yo\'lovchi'}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs font-semibold text-on-surface leading-tight line-clamp-2">
                        {item.reason}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.type === 'Doimiy'
                          ? 'bg-error-container/30 text-error border-error-container/60'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {item.type === 'Doimiy' ? 'Doimiy' : 'Vaqtincha'}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-on-surface leading-tight">{item.date}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">{item.time}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onUnblockUser(item.id)}
                        className="p-2 text-secondary hover:bg-secondary-container/20 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center gap-1.5 ml-auto text-xs font-bold"
                        title="Blokdan chiqarish"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span className="hidden lg:inline text-[11px] uppercase tracking-wider">Blokdan yechish</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* policy advisory note */}
      <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 flex items-start gap-4 text-xs font-body-md text-on-surface-variant">
        <span className="p-2.5 bg-error-container/15 text-error rounded-xl">
          <ShieldAlert className="w-5 h-5" />
        </span>
        <div className="space-y-1">
          <h4 className="font-bold text-on-surface leading-none text-sm">Xavfsizlik siyosati eslatmasi</h4>
          <p className="leading-relaxed opacity-90 mt-1">
            Qora ro'yxatga olingan hisoblarning API kalitlari va Telegram avtorizatsiya tokenlari bekor qilinadi. Doimiy bloklangan haydovchilar administrator tomonidan afv etilmaguncha qatnovlarga qo'yilmaydi. Blokdan chiqarishdan oldin tizim audit jurnallarini ko'rib chiqishingiz tavsiya etiladi.
          </p>
        </div>
      </div>

      {/* Add To Blacklist Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full border border-outline-variant shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30 mb-5">
              <Ban className="w-5 h-5 text-error" />
              <h3 className="font-display-lg text-base font-bold text-on-surface">Foydalanuvchini qora ro'yxatga qo'shish</h3>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-4 text-xs font-body-md">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Hisob roli
                  </label>
                  <select
                    value={newOriginalRole}
                    onChange={(e) => setNewOriginalRole(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-2.5 px-3 text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="Passenger">Yo'lovchi</option>
                    <option value="Driver">Haydovchi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Bloklash turi
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-2.5 px-3 text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="Doimiy">Doimiy (Permanent)</option>
                    <option value="Vaqtincha">Vaqtincha (Temporary)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  To'liq ism-sharifi
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="masalan: Azizbek Sodiqov"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-2.5 px-3 font-bold text-on-surface focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="masalan: +998 90 123 45 67"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-2.5 px-3 font-mono font-bold text-on-surface focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Telegram foydalanuvchi nomi
                  </label>
                  <input
                    type="text"
                    value={newTelegramUser}
                    onChange={(e) => setNewTelegramUser(e.target.value)}
                    placeholder="masalan: @username"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-2.5 px-3 font-bold text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Bloklash sababi (Batafsil ma'lumot)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Platforma qoidalarining buzilishini batafsil tushuntiring (masalan: to'lanmagan haq, qalbaki buyurtmalar)"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-2.5 px-3 text-on-surface focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-surface-container-highest/50 text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-error text-on-error font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  Hisobni cheklash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
