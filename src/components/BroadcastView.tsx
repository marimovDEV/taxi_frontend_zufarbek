/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Radio, Sparkles, MessageSquareCode, Clock } from 'lucide-react';
import { Broadcast } from '../types';

interface BroadcastViewProps {
  broadcasts: Broadcast[];
  onSendBroadcast: (newBroadcast: Omit<Broadcast, 'id' | 'sentCount' | 'totalCount' | 'timestamp' | 'dateStr'>) => void;
}

export default function BroadcastView({ broadcasts, onSendBroadcast }: BroadcastViewProps) {
  // Compose form state
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('All Users');
  const [district, setDistrict] = useState('All Xorazm Districts');
  const [message, setMessage] = useState('');

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendBroadcast({
      title,
      targetAudience: audience,
      districtFilter: district,
      messageContent: message,
      status: 'Sending',
      audienceCountText: audience === 'All Users' ? '25,000 Foydalanuvchi' : audience === 'Drivers Only' ? '4,500 Haydovchi' : '20,500 Yo\'lovchi',
      districtText: district === 'All Xorazm Districts' ? 'Barcha tumanlar' : district.split(' ')[0],
    });

    // Clear composer
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Xabarnoma markazi</h2>
        <p className="text-on-surface-variant font-body-md mt-1">
          Haydovchilar va yo'lovchilarga zudlik bilan SMS, Telegram va push-bildirishnomalarni yuborish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Composer Form */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/30 mb-6">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Yangi xabarnoma yozish</h3>
          </div>

          <form onSubmit={handleComposeSubmit} className="space-y-5 text-xs font-body-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Audience targeting */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Maqsadli auditoriya
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="All Users">Barcha foydalanuvchilar (Haydovchilar va Yo'lovchilar)</option>
                  <option value="Drivers Only">Faqat haydovchilar (Faol haydovchilar parki)</option>
                  <option value="Passengers Only">Faqat yo'lovchilar (Mijozlar)</option>
                </select>
              </div>

              {/* District Filtering */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Tuman filtri
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="All Xorazm Districts">Xorazmning barcha tumanlari</option>
                  <option value="Urgench City">Urganch shahri markazi</option>
                  <option value="Khiva City">Xiva shahri (Turistik hudud)</option>
                  <option value="Gurlen District">Gurlan tumani</option>
                  <option value="Shovot District">Shovot tumani</option>
                  <option value="Yangiarik District">Yangiariq tumani</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Xabarnoma sarlavhasi / Bildirishnoma sarlavhasi
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="masalan: Yo'l haqi narxlari o'zgarishi, Tizimdagi profilaktika ishlari"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 px-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline/70"
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Xabar matni (Markdown formatida)
                </label>
                <span className="text-[10px] text-outline flex items-center gap-1 font-semibold">
                  <MessageSquareCode className="w-3.5 h-3.5" />
                  Maksimal 1 000 ta belgi
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bu yerga xabar tafsilotlarini kiriting. Maxsus qisqartmalar va formatlar qo'llab-quvvatlanadi: *qalin*, _kursiv_."
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3.5 px-4 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-outline/70 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary/25 cursor-pointer active:scale-[0.98] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Hozir xabar yuborish</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Predictive Reach & History */}
        <div className="space-y-6">
          {/* Peak Reach Prediction Card */}
          <div className="bg-gradient-to-br from-primary/15 to-indigo-500/10 p-6 rounded-2xl border border-primary/25 shadow-sm relative overflow-hidden group">
            {/* Ambient decorative icon background */}
            <div className="absolute -right-8 -top-8 text-primary opacity-[0.06] transform scale-[2.2]">
              <Sparkles className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[11px] font-extrabold text-primary uppercase tracking-wider">Auditoriya qamrovi prognozi</h4>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Yuborish uchun optimal vaqt</p>
              </div>
              <span className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </span>
            </div>

            <div className="flex items-center gap-5 my-2">
              {/* Radial Progress Gauge */}
              <div className="relative w-20 h-20 shrink-0 select-none">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track circle */}
                  <path
                    className="text-primary/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Foreground progress circle */}
                  <path
                    className="text-primary"
                    strokeWidth="3.5"
                    strokeDasharray="98.4, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-primary leading-none">98.4%</span>
                  <span className="text-[7px] text-outline uppercase font-bold tracking-widest mt-0.5">Qamrov</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-extrabold text-on-surface leading-tight">18:00 - 20:00</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1 leading-snug">
                  Optimal xabar yetkazish foizi prognoz qilindi. Tarmoq yuklamasi minimal bo'lgan optimal rejim.
                </p>
              </div>
            </div>
          </div>

          {/* Broadcast History List */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider pb-3 border-b border-outline-variant/30 mb-4">
              Yaqindagi xabarnomalar jurnali
            </h3>

            <div className="space-y-4">
              {broadcasts.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/20 hover:border-outline-variant/40 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-xs text-on-surface truncate pr-2 leading-tight">
                      {log.title}
                    </h4>
                    {log.status === 'Completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[8px] font-extrabold uppercase shrink-0 border border-secondary-container/20">
                        YETKAZILDI
                      </span>
                    )}
                    {log.status === 'Failed' && (
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[8px] font-extrabold uppercase shrink-0 border border-error-container/20">
                        XATO
                      </span>
                    )}
                    {log.status === 'Sending' && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[8px] font-extrabold uppercase shrink-0 border border-primary/20 animate-pulse">
                        YUBORILMOQDA
                      </span>
                    )}
                  </div>

                  <p className="text-[9px] text-on-surface-variant/90 font-medium mt-1.5">
                    Maqsad: {log.audienceCountText} • {log.districtText}
                  </p>

                  {/* Broadcast description / fail notes */}
                  {log.status === 'Failed' && log.errorReason && (
                    <p className="text-[9px] text-error font-semibold mt-1 bg-error-container/10 p-1.5 rounded-lg border border-error-container/20">
                      {log.errorReason}
                    </p>
                  )}

                  {/* Sending progress simulator visual */}
                  {log.status === 'Sending' && (
                    <div className="mt-2.5 space-y-1">
                      <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${(log.sentCount / log.totalCount) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[8px] font-semibold text-outline-variant">
                        <span>Navbatda...</span>
                        <span>
                          {log.sentCount.toLocaleString()} / {log.totalCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-outline-variant/20 text-[9px] text-outline font-medium">
                    <span>ID: #{log.id}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
