/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, RefreshCw, Star, ArrowRight, Server, CheckCircle2 } from 'lucide-react';
import { Driver, SystemStats } from '../types';
import { HIGH_TRAFFIC_ROUTES, SYSTEM_HEALTH_ITEMS } from '../data';

interface DashboardViewProps {
  stats: SystemStats;
  drivers: Driver[];
  trendData: any[];
  onExportClick: () => void;
  onViewAllDriversClick: () => void;
}

export default function DashboardView({
  stats,
  drivers,
  trendData,
  onExportClick,
  onViewAllDriversClick,
}: DashboardViewProps) {
  // SVG Chart interactive state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fallback trend data if API has less than 2 data points
  const fallbackTrendData = [
    { day: '01 May', trips: 50, orders: 50 },
    { day: '02 May', trips: 50, orders: 50 },
  ];
  const safeTrendData = trendData && trendData.length >= 2 ? trendData : fallbackTrendData;

  // Helper to format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M UZS`;
    }
    return `${val.toLocaleString()} UZS`;
  };

  // Sort top performers by rating
  const topDrivers = [...drivers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight">Tizim tahlili</h2>
          <p className="text-on-surface-variant font-body-md mt-1">Xorazm viloyati taksi parkining real vaqt rejimidagi ko'rsatkichlari.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-highest/40 text-on-surface px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-surface-container-highest transition-colors cursor-pointer border border-outline-variant/30">
            <Calendar className="w-4 h-4 text-primary" />
            Oxirgi 15 kun
          </button>
          <button
            onClick={onExportClick}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Eksport qilish
          </button>
        </div>
      </div>

      {/* Bento Grid Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Users */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <span className="text-secondary font-bold text-xs flex items-center gap-1 bg-secondary-container/20 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +12%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Jami foydalanuvchilar</h3>
            <p className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">{stats.totalUsersCount.toLocaleString()}</p>
          </div>
          <div className="flex gap-4 pt-3 mt-3 border-t border-outline-variant/30">
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Haydovchilar</p>
              <p className="font-bold text-primary text-sm mt-0.5">{stats.activeDriversCount.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/30" />
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Yo'lovchilar</p>
              <p className="font-bold text-on-surface text-sm mt-0.5">{(stats.totalUsersCount - stats.activeDriversCount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Active Trips */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>navigation</span>
            </div>
            <span className="text-secondary font-bold text-xs flex items-center gap-1 bg-secondary-container/20 px-2.5 py-1 rounded-full">
              Faol
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Faol qatnovlar</h3>
            <p className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">{stats.liveTripsCount}</p>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-5">
            <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${stats.seatUtilization}%` }} />
          </div>
          <p className="text-[11px] text-on-surface-variant/80 mt-1.5">Taksi parkidan foydalanish darajasi: {stats.seatUtilization}%</p>
        </div>

        {/* Card 3: Today's Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            </div>
            <span className="text-error font-bold text-xs flex items-center gap-1 bg-error-container/20 px-2.5 py-1 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              -3%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Bugungi buyurtmalar</h3>
            <p className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">{stats.pendingOrdersCount.toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full inline-block">
              O'rtacha: 1,950 / kun
            </span>
          </div>
        </div>

        {/* Card 4: Platform Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <div className="px-2 py-0.5 bg-amber-500/15 text-amber-700 rounded text-[10px] font-bold border border-amber-500/10">10% KOMISSIYA</div>
          </div>
          <div className="mt-4">
            <h3 className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Tushum (Netto)</h3>
            <p className="font-display-lg text-3xl font-extrabold text-on-surface mt-1">
              {formatCurrency(stats.systemBalance)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white border border-white">C</div>
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold text-white border border-white">M</div>
            </div>
            <p className="text-[10px] text-on-surface-variant font-medium">Asosiy usullar: Click, Payme</p>
          </div>
        </div>
      </div>

      {/* Main Trends Chart & Diagnostics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trends Column */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-on-surface tracking-tight">Ish unumdorligi ko'rsatkichlari</h3>
              <p className="text-xs text-on-surface-variant">Oxirgi 15 kundagi faol qatnovlar va buyurtmalar ko'rsatkichi</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                <span className="text-xs font-semibold text-on-surface-variant">Qatnovlar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                <span className="text-xs font-semibold text-on-surface-variant">Buyurtmalar</span>
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG Area Line Chart */}
          <div className="flex-1 min-h-[280px] relative mt-2 select-none">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3525cd" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006c49" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#006c49" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line stroke="#e2e8f0" strokeDasharray="3" x1="0" y1="40" x2="800" y2="40" />
              <line stroke="#e2e8f0" strokeDasharray="3" x1="0" y1="120" x2="800" y2="120" />
              <line stroke="#e2e8f0" strokeDasharray="3" x1="0" y1="200" x2="800" y2="200" />

              {/* Guide Vertical lines for hover state */}
              {hoveredIndex !== null && (
                <line
                  stroke="#3525cd"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeDasharray="4"
                  x1={(hoveredIndex * (800 / (safeTrendData.length - 1)))}
                  y1="0"
                  x2={(hoveredIndex * (800 / (safeTrendData.length - 1)))}
                  y2="220"
                />
              )}

              {/* Primary Path (Trips) */}
              <path
                d={safeTrendData.reduce((acc, curr, i) => {
                  const x = i * (800 / (safeTrendData.length - 1));
                  // map value to Y (min 50 max 300, canvas range 20 to 220)
                  const y = 220 - ((curr.trips - 50) / 250) * 180;
                  return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#3525cd"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d={safeTrendData.reduce((acc, curr, i) => {
                  const x = i * (800 / (safeTrendData.length - 1));
                  const y = 220 - ((curr.trips - 50) / 250) * 180;
                  return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '') + ` L 800 220 L 0 220 Z`}
                fill="url(#primaryGradient)"
              />

              {/* Secondary Path (Orders) */}
              <path
                d={safeTrendData.reduce((acc, curr, i) => {
                  const x = i * (800 / (safeTrendData.length - 1));
                  const y = 220 - ((curr.orders - 50) / 250) * 180;
                  return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#006c49"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Hotzones */}
              {safeTrendData.map((d, i) => {
                const x = i * (800 / (safeTrendData.length - 1));
                const yTrips = 220 - ((d.trips - 50) / 250) * 180;
                const yOrders = 220 - ((d.orders - 50) / 250) * 180;
                return (
                  <g key={i}>
                    {hoveredIndex === i && (
                      <>
                        <circle cx={x} cy={yTrips} r="6" fill="#3525cd" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={x} cy={yOrders} r="6" fill="#006c49" stroke="#ffffff" strokeWidth="2" />
                      </>
                    )}
                    {/* Hover hotspot rectangle cover */}
                    <rect
                      x={x - 20}
                      y="0"
                      width="40"
                      height="230"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Bottom X-Axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[10px] text-on-surface-variant font-mono font-bold">
              <span>{safeTrendData[0]?.day}</span>
              <span>{safeTrendData[Math.floor(safeTrendData.length * 0.2)]?.day}</span>
              <span>{safeTrendData[Math.floor(safeTrendData.length * 0.4)]?.day}</span>
              <span>{safeTrendData[Math.floor(safeTrendData.length * 0.6)]?.day}</span>
              <span>{safeTrendData[Math.floor(safeTrendData.length * 0.8)]?.day}</span>
              <span>{safeTrendData[safeTrendData.length - 1]?.day}</span>
            </div>

            {/* Float Tooltip Overlay */}
            {hoveredIndex !== null && (
              <div
                className="absolute z-10 bg-inverse-surface text-inverse-on-surface text-xs rounded-xl p-3 shadow-xl border border-outline border-opacity-20 flex flex-col gap-1 w-36 animate-in fade-in zoom-in duration-100"
                style={{
                  left: `${Math.min(
                    Math.max(hoveredIndex * (100 / (safeTrendData.length - 1)) - 8, 1),
                    82
                  )}%`,
                  top: '10px',
                }}
              >
                <p className="font-bold text-[10px] text-outline-variant tracking-wider uppercase">
                  {safeTrendData[hoveredIndex].day}
                </p>
                <div className="flex justify-between items-center mt-1 border-t border-outline-variant/10 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Qatnovlar:
                  </span>
                  <span className="font-bold text-sm text-primary-fixed">
                    {safeTrendData[hoveredIndex].trips}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Buyurtmalar:
                  </span>
                  <span className="font-bold text-sm text-secondary-fixed">
                    {safeTrendData[hoveredIndex].orders}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Health Status Section */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface tracking-tight">Tizim holati</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Infratuzilmaning real vaqt rejimidagi ko'rsatkichlari</p>
          </div>

          <div className="space-y-3.5 my-5 flex-1 flex flex-col justify-center">
            {SYSTEM_HEALTH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container/30 border border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface leading-tight">{item.name === 'SMS Auth Gateway' ? 'SMS Shlyuzi' : item.name === 'PostgreSQL Cloud DB' ? 'PostgreSQL ma\'lumotlar bazasi' : item.name === 'API Secure Proxy' ? 'API Xavfsiz Proksi' : item.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{item.details === 'Operational' ? 'Ishlamoqda' : item.details === 'Synced' ? 'Sinxronlangan' : item.details === 'SSL Active' ? 'SSL Faol' : item.details}</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_8px_#006c49]" />
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 bg-surface-container-highest/40 text-primary font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-primary/10 transition-colors cursor-pointer border border-outline-variant/30">
            Batafsil metrikalarni ko'rish
          </button>
        </div>
      </div>

      {/* Top Performing Drivers & High-Traffic Routes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Top Drivers */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/40 flex justify-between items-center">
            <h3 className="text-sm font-bold text-on-surface tracking-tight">Eng faol haydovchilar</h3>
            <button
              onClick={onViewAllDriversClick}
              className="text-primary text-xs font-bold hover:underline cursor-pointer"
            >
              Hammasini ko'rish
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Haydovchi</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Reyting</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Qatnovlar</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Daromad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {topDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-dim overflow-hidden relative border border-outline-variant/20 shrink-0">
                          <img
                            src={driver.photoUrl}
                            alt={driver.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors leading-snug">
                            {driver.name}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                            {driver.vehicleModel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-xs text-on-surface">{driver.rating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-on-surface text-center">
                      {driver.tripsCompleted}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs font-extrabold text-primary">
                      {formatCurrency(driver.earnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top High Traffic Routes */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm p-6 flex flex-col">
          <div className="border-b border-outline-variant/40 pb-4 mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-on-surface tracking-tight">Ommabop gavjum yo'nalishlar</h3>
            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-extrabold uppercase tracking-wider">
              XORAZM VILOYATI
            </span>
          </div>

          <div className="space-y-5 flex-1 flex flex-col justify-between">
            {HIGH_TRAFFIC_ROUTES.map((route) => (
              <div key={route.id} className="flex items-center gap-4 group cursor-pointer">
                {/* Route bullets */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary border border-white shadow-sm" />
                  <div className="w-0.5 h-5 bg-outline-variant/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary border border-white shadow-sm" />
                </div>

                {/* Route Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <p className="font-bold text-xs text-on-surface truncate leading-tight">
                      {route.start}
                    </p>
                    <span className="text-[11px] font-bold text-on-surface shrink-0">
                      {route.tripsCountText.replace('trips', 'qatnov')}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                    {route.end} yo'nalishi bo'yicha
                  </p>

                  {/* Percentage Progress Bar */}
                  <div className="mt-1.5 w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full group-hover:bg-primary-container transition-colors"
                      style={{ width: `${route.percentage}%` }}
                    />
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
