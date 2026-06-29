/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, Users, Route, Megaphone, Ban, Settings, HelpCircle, LogOut, Car } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewDispatchClick: () => void;
  onLogoutClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onNewDispatchClick, onLogoutClick }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'trips', label: 'Qatnovlar va Buyurtmalar', icon: Route },
    { id: 'broadcast', label: 'Ommaviy xabarnoma', icon: Megaphone },
    { id: 'blacklist', label: 'Qora ro\'yxat', icon: Ban },
    { id: 'settings', label: 'Tizim sozlamalari', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 flex flex-col justify-between py-6">
      <div>
        {/* Brand Logo Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display-lg text-primary text-[20px] font-bold leading-none tracking-tight">Xorazm Taxi</h1>
            <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5 opacity-80">Boshqaruv tizimi</p>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-left cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-primary-container/10 text-primary font-semibold border-l-4 border-primary rounded-l-none rounded-r-xl'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant/80'}`} />
                <span className="font-body-md text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with Dispatch Action */}
      <div className="px-4 space-y-4">
        <button
          onClick={onNewDispatchClick}
          className="w-full bg-primary text-on-primary py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-200"
        >
          <Car className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Yangi qatnov</span>
        </button>

        <div className="pt-4 border-t border-outline-variant">
          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
              activeTab === 'help'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <HelpCircle className="w-5 h-5 opacity-80" />
            <span className="font-body-md text-sm">Yordam markazi</span>
          </button>
          
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-body-md text-sm font-medium">Tizimdan chiqish</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
