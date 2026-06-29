/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, History, ShieldAlert, CheckCircle2, Menu, Moon, Sun } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  settings: AppSettings;
  pendingCount: number;
  onNotificationsClick: () => void;
  onHistoryClick: () => void;
  onToggleTheme?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  settings,
  pendingCount,
  onNotificationsClick,
  onHistoryClick,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="h-16 fixed top-0 right-0 w-[calc(100%-280px)] ml-[280px] px-6 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant z-40 flex justify-between items-center transition-all duration-300">
      {/* Search Bar & Nav Options */}
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-80 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidirish..."
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-11 pr-4 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>


      </div>

      {/* Right Telemetry Controls */}
      <div className="flex items-center gap-4">
        {/* Diagnostic Status Pill */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
            settings.systemStatus === 'Healthy'
              ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30'
              : 'bg-error-container/20 text-on-error-container border-error-container/30'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              settings.systemStatus === 'Healthy' ? 'bg-secondary' : 'bg-error'
            }`}
          />
          <span className="font-label-md text-[10px] uppercase tracking-wider font-bold">
            Tizim: {settings.systemStatus === 'Healthy' ? 'Barqaror' : 'Muammoli'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full cursor-pointer transition-colors"
            title={settings.activeTheme === 'light' ? 'Tungi rejimga o\'tish' : 'Kunduzgi rejimga o\'tish'}
          >
            {settings.activeTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 animate-spin-slow" />
            )}
          </button>

          {/* Notifications button with optional pending badge */}
          <button
            onClick={onNotificationsClick}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full cursor-pointer relative transition-colors"
            title="Tizim bildirishnomalari"
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-error text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-surface-bright">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={onHistoryClick}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/20 rounded-full cursor-pointer transition-colors"
            title="Tizim jurnali"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-sm text-on-surface leading-none">Admin Xorazm</p>
            <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5 font-bold">
              Boshqaruvchi
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary/20 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0Oaw7WahMtFMl2ArCD74totFmyEF7a01ZnwH07rGoorhHti3AEa-A_Wcyp5jinagTZL_p05qswLL_thdNzMktz9ikMhqwDlYFGCnkjViOZw6v1sBO7smfRDzGvXub-W3bOa2gFlJZLfPXq8XRuMRVQbt6-xyG-5OV-BtdE79bELMcAGJRKfTPrsFmmpjr4HTxCgAhN1se5kPich0jPDyfVjJQzojbpBulwGJPiS9rjrFsEPvygxJe7Q"
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
