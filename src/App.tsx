/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TripsView from './components/TripsView';
import UsersView from './components/UsersView';
import BroadcastView from './components/BroadcastView';
import BlacklistView from './components/BlacklistView';
import SettingsView from './components/SettingsView';
import NewDispatchModal from './components/NewDispatchModal';
import LoginView from './components/LoginView';
import Toast from './components/Toast';
import { Trip, Order, Broadcast, BlacklistUser, SystemStats, AppSettings, Driver, Passenger } from './types';
import { INITIAL_SETTINGS } from './data';
import * as api from './api';
import {
  mapUserToDriver,
  mapUserToPassenger,
  mapApiTrip,
  mapApiOrder,
  mapApiBroadcast,
  mapApiBlacklist,
} from './mappers';
import { X, Bell, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Entity States (boshlanishda bo'sh — API'dan to'ldiriladi)
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    liveTripsCount: 0,
    pendingOrdersCount: 0,
    seatUtilization: 0,
    volumeToday: 0,
    totalUsersCount: 0,
    activeDriversCount: 0,
    systemBalance: 0,
    bannedUsersCount: 0,
  });
  // Tarif/komissiya/SMS kabi maydonlar backendda yo'q — faqat lokal UI sozlamasi
  // sifatida saqlanadi. Bot/aloqa maydonlari haqiqiy BotSetting jadvalidan keladi.
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedTheme = localStorage.getItem('theme');
    return {
      ...INITIAL_SETTINGS,
      activeTheme: (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : INITIAL_SETTINGS.activeTheme,
    };
  });

  // Layout UI Overlays State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isLogsPanelOpen, setIsLogsPanelOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    'Tizim Django REST API orqali ulandi.',
    'Foydalanuvchi sessiyasi tasdiqlandi.',
  ]);

  const pushLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  // --- Ma'lumotlarni backenddan yuklash ---
  const loadAllData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const [usersRaw, tripsRaw, ordersRaw, broadcastsRaw, blacklistRaw, statsRaw, botSettingsRaw] = await Promise.all([
        api.fetchUsers(),
        api.fetchTrips(),
        api.fetchOrders(),
        api.fetchBroadcasts(),
        api.fetchBlacklist(),
        api.fetchStats(),
        api.fetchBotSettings(),
      ]);

      const usersById = new Map<string, any>(usersRaw.map((u: any) => [String(u.telegram_id), u]));

      setDrivers(usersRaw.filter((u: any) => u.role === 'driver').map(mapUserToDriver));
      setPassengers(usersRaw.filter((u: any) => u.role !== 'driver').map(mapUserToPassenger));
      setTrips(tripsRaw.map((t: any) => mapApiTrip(t, usersById)));
      setOrders(ordersRaw.map(mapApiOrder));
      setBroadcasts(broadcastsRaw.map(mapApiBroadcast));
      setBlacklist(blacklistRaw.map(mapApiBlacklist));

      setStats((prev) => ({
        ...prev,
        totalUsersCount: statsRaw.total_users ?? prev.totalUsersCount,
        activeDriversCount: statsRaw.drivers ?? prev.activeDriversCount,
        liveTripsCount: statsRaw.active_trips ?? prev.liveTripsCount,
        pendingOrdersCount: ordersRaw.filter((o: any) => o.status === 'pending').length,
        bannedUsersCount: usersRaw.filter((u: any) => u.status === 'banned').length,
      }));

      const settingsByKey: Record<string, string> = {};
      botSettingsRaw.forEach((s: any) => { settingsByKey[s.key] = s.value; });
      setSettings((prev) => ({
        ...prev,
        telegramBotToken: settingsByKey['telegram_bot_token'] ?? prev.telegramBotToken,
        telegramBotUsername: settingsByKey['telegram_bot_username'] ?? prev.telegramBotUsername,
        telegramBotName: settingsByKey['telegram_bot_name'] ?? prev.telegramBotName,
        contactSectionTitle: settingsByKey['contact_title'] ?? prev.contactSectionTitle,
        contactPhone: settingsByKey['contact_phone'] ?? prev.contactPhone,
        contactTelegramUsername: settingsByKey['contact_telegram'] ?? prev.contactTelegramUsername,
        contactAdditionalNotes: settingsByKey['contact_description'] ?? prev.contactAdditionalNotes,
      }));
    } catch (err: any) {
      triggerToast(`Ma'lumotlarni yuklashda xatolik: ${err?.message || err}`, 'error');
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // --- Sessiya tekshiruvi (ilova ochilganda) ---
  useEffect(() => {
    api.fetchMe()
      .then(() => {
        setIsAuthenticated(true);
        loadAllData();
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, [loadAllData]);

  const handleLoginSubmit = async (username: string, password: string) => {
    await api.login(username, password);
    setIsAuthenticated(true);
    await loadAllData();
    pushLog(`Superuser tizimga kirdi: ${username}.`);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setIsAuthenticated(false);
      triggerToast('Tizimdan muvaffaqiyatli chiqildi.', 'info');
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.activeTheme === 'light' ? 'dark' : 'light';
    setSettings((prev) => ({ ...prev, activeTheme: nextTheme }));
    localStorage.setItem('theme', nextTheme);
    pushLog(`Tizim rejimi o'zgartirildi: ${nextTheme === 'light' ? 'Kunduzgi' : 'Tungi'}`);
    triggerToast(nextTheme === 'light' ? 'Kunduzgi rejim faollashtirildi' : 'Tungi rejim (qorong\'u) faollashtirildi', 'info');
  };

  // 1. Cancel Trip Handler
  const handleCancelTrip = async (tripId: string) => {
    try {
      await api.patchTrip(tripId, { status: 'cancelled' });
      setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: 'CANCELLED' as const } : t)));
      setStats((prev) => ({ ...prev, liveTripsCount: Math.max(0, prev.liveTripsCount - 1) }));
      pushLog(`Faol qatnov bekor qilindi. Qatnov ID: #${tripId}`);
      triggerToast(`Qatnov #${tripId} vaqtincha to'xtatildi.`, 'warning');
    } catch (err: any) {
      triggerToast(`Bekor qilishda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // Update Trip Price Handler
  const handleUpdateTripPrice = async (tripId: string, newPrice: number) => {
    try {
      await api.patchTrip(tripId, { price: newPrice });
      setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, price: newPrice } : t)));
      pushLog(`Qatnov narxi yangilandi. Qatnov ID: #${tripId}, Yangi narx: ${newPrice.toLocaleString()} UZS`);
      triggerToast(`Qatnov narxi yangilandi: ${newPrice.toLocaleString()} UZS.`, 'success');
    } catch (err: any) {
      triggerToast(`Narxni yangilashda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 2. Confirm Booking Order Handler
  const handleConfirmOrder = async (orderId: string) => {
    const orderToConfirm = orders.find((o) => o.id === orderId);
    if (!orderToConfirm) return;
    try {
      await api.patchOrder(orderId, { status: 'confirmed' });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CONFIRMED' as const } : o)));
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === orderToConfirm.tripId) {
            return { ...t, emptySeats: Math.max(0, t.emptySeats - orderToConfirm.seatsRequested) };
          }
          return t;
        })
      );
      const targetTrip = trips.find((t) => t.id === orderToConfirm.tripId);
      const tripPrice = targetTrip ? targetTrip.price : 0;
      const addedRevenue = orderToConfirm.seatsRequested * tripPrice * (settings.commissionFee / 100);
      setStats((prev) => ({
        ...prev,
        pendingOrdersCount: Math.max(0, prev.pendingOrdersCount - 1),
        volumeToday: prev.volumeToday + addedRevenue,
        systemBalance: prev.systemBalance + addedRevenue,
      }));
      pushLog(`Buyurtma tasdiqlandi. ID: #${orderId}.`);
      triggerToast(`Buyurtma tasdiqlandi! ${orderToConfirm.seatsRequested} ta o'rindiq band qilindi.`, 'success');
    } catch (err: any) {
      triggerToast(`Tasdiqlashda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 3. Reject Booking Order Handler
  const handleRejectOrder = async (orderId: string) => {
    try {
      await api.patchOrder(orderId, { status: 'cancelled' });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'REJECTED' as const } : o)));
      setStats((prev) => ({ ...prev, pendingOrdersCount: Math.max(0, prev.pendingOrdersCount - 1) }));
      pushLog(`Buyurtma rad etildi. ID: #${orderId}.`);
      triggerToast(`Buyurtma rad etildi.`, 'error');
    } catch (err: any) {
      triggerToast(`Rad etishda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 4. Update Passenger Balance Handler
  const handleUpdateBalance = async (passengerId: string, newBalance: number) => {
    const oldPassenger = passengers.find((p) => p.id === passengerId);
    const currentBalance = oldPassenger ? oldPassenger.balance : 0;
    const difference = newBalance - currentBalance;
    try {
      await api.patchUser(passengerId, { balance: newBalance });
      setPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, balance: newBalance } : p)));
      setStats((prev) => ({ ...prev, systemBalance: prev.systemBalance + difference }));
      pushLog(`Yo'lovchi #${passengerId} balansi yangilandi: ${newBalance.toLocaleString()} UZS.`);
      triggerToast(`${oldPassenger?.name || 'Yo\'lovchi'} hamyon balansi o'zgartirildi.`, 'success');
    } catch (err: any) {
      triggerToast(`Balansni yangilashda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 5. Block User & Send to Qora Ro'yxat
  const handleBlockUser = async (userType: 'driver' | 'passenger', id: string) => {
    const isPassenger = userType === 'passenger';
    const target = isPassenger ? passengers.find((x) => x.id === id) : drivers.find((x) => x.id === id);
    if (!target) return;

    try {
      await api.patchUser(id, { status: 'banned' });
      const created = await api.createBlacklistEntry({
        telegram_id: Number(id),
        phone: isPassenger ? (target as Passenger).phone : null,
        reason: isPassenger
          ? "Tizim qoidalarini buzish: Shubhali balans harakatlari"
          : "Yo'l haqini sun'iy oshirish va tarif qoidalarini buzish",
      });

      if (isPassenger) {
        setPassengers((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'Banned' as const } : x)));
      } else {
        setDrivers((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'Offline' as const } : x)));
      }

      const blockItem: BlacklistUser = {
        id: String(created.id),
        name: target.name,
        photoUrl: (target as any).photoUrl,
        initials: isPassenger ? (target as Passenger).initials : initialsFromName(target.name),
        telegramId: id,
        telegramUsername: isPassenger ? (target as Passenger).telegramUsername : '',
        phone: isPassenger ? (target as Passenger).phone : '',
        reason: created.reason || '',
        date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        type: 'Doimiy',
        originalRole: isPassenger ? 'Passenger' : 'Driver',
      };

      setBlacklist((prev) => [blockItem, ...prev]);
      setStats((prev) => ({ ...prev, bannedUsersCount: prev.bannedUsersCount + 1 }));
      pushLog(`Foydalanuvchi bloklandi: ${target.name} (#${id}).`);
      triggerToast(`${target.name} tizimdan bloklandi.`, 'error');
    } catch (err: any) {
      triggerToast(`Bloklashda xatolik: ${err?.message || err}`, 'error');
    }
  };

  function initialsFromName(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  // 6. Unblock User & Pardon
  const handleUnblockUser = async (id: string) => {
    const item = blacklist.find((x) => x.id === id);
    if (!item) return;
    try {
      if (item.telegramId) {
        await api.patchUser(item.telegramId, { status: 'active' });
      }
      await api.deleteBlacklistEntry(id);

      setBlacklist((prev) => prev.filter((x) => x.id !== id));
      if (item.originalRole === 'Passenger') {
        setPassengers((prev) => prev.map((x) => (x.id === item.telegramId ? { ...x, status: 'Active' as const } : x)));
      } else {
        setDrivers((prev) => prev.map((x) => (x.id === item.telegramId ? { ...x, status: 'Active' as const } : x)));
      }
      setStats((prev) => ({ ...prev, bannedUsersCount: Math.max(0, prev.bannedUsersCount - 1) }));
      pushLog(`Foydalanuvchi qora ro'yxatdan chiqarildi: ${item.name} (#${id}).`);
      triggerToast(`${item.name} muvaffaqiyatli faollashtirildi! Barcha huquqlar tiklandi.`, 'success');
    } catch (err: any) {
      triggerToast(`Blokdan chiqarishda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 7. Add direct to Blacklist
  const handleAddToBlacklist = async (newUser: Omit<BlacklistUser, 'id' | 'date' | 'time'>) => {
    try {
      const created = await api.createBlacklistEntry({
        telegram_id: newUser.telegramId ? Number(newUser.telegramId) : null,
        phone: newUser.phone || null,
        reason: newUser.reason,
      });

      const dateStr = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const completeUser: BlacklistUser = { ...newUser, id: String(created.id), date: dateStr, time: timeStr };

      setBlacklist((prev) => [completeUser, ...prev]);
      setStats((prev) => ({ ...prev, bannedUsersCount: prev.bannedUsersCount + 1 }));

      if (newUser.telegramId) {
        try {
          await api.patchUser(newUser.telegramId, { status: 'banned' });
        } catch {
          /* foydalanuvchi tizimda topilmasa e'tiborsiz qoldiramiz */
        }
      }
      if (newUser.originalRole === 'Passenger') {
        setPassengers((prev) => prev.map((x) => (x.telegramId === newUser.telegramId ? { ...x, status: 'Banned' as const } : x)));
      } else {
        setDrivers((prev) => prev.map((x) => (x.id === newUser.telegramId ? { ...x, status: 'Offline' as const } : x)));
      }

      pushLog(`Yangi foydalanuvchi qora ro'yxatga qo'shildi: ${newUser.name}.`);
      triggerToast(`${newUser.name} uchun cheklov kartasi ro'yxatga olindi.`, 'warning');
    } catch (err: any) {
      triggerToast(`Qora ro'yxatga qo'shishda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 8. Compose and Send Broadcast (haqiqiy bot orqali yuboriladi)
  const handleSendBroadcast = async (
    newB: Omit<Broadcast, 'id' | 'sentCount' | 'totalCount' | 'timestamp' | 'dateStr'>
  ) => {
    const roleMap: Record<string, string> = {
      'All Users': 'all',
      'Drivers Only': 'driver',
      'Passengers Only': 'passenger',
    };
    try {
      pushLog(`Ommaviy xabarnoma yaratilmoqda: "${newB.title}"`);
      triggerToast(`Xabarnoma yuborilmoqda...`, 'info');

      const created = await api.createBroadcast({
        title: newB.title,
        message: newB.messageContent,
        target_role: roleMap[newB.targetAudience] || 'all',
        target_district: newB.districtFilter && newB.districtFilter !== 'All Xorazm Districts' ? newB.districtFilter : null,
      });
      await api.sendBroadcast(created.id);

      const freshList = await api.fetchBroadcasts();
      setBroadcasts(freshList.map(mapApiBroadcast));

      pushLog(`Ommaviy xabarnoma Telegram bot orqali yuborildi [ID: #${created.id}].`);
      triggerToast(`Xabar muvaffaqiyatli yuborildi.`, 'success');
    } catch (err: any) {
      triggerToast(`Xabar yuborishda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 9. Save System settings Configs
  const handleSaveSettings = async (updated: AppSettings) => {
    setSettings(updated);
    try {
      await Promise.all([
        api.upsertBotSetting('telegram_bot_token', updated.telegramBotToken),
        api.upsertBotSetting('telegram_bot_username', updated.telegramBotUsername),
        api.upsertBotSetting('telegram_bot_name', updated.telegramBotName),
        api.upsertBotSetting('contact_title', updated.contactSectionTitle),
        api.upsertBotSetting('contact_phone', updated.contactPhone),
        api.upsertBotSetting('contact_telegram', updated.contactTelegramUsername),
        api.upsertBotSetting('contact_description', updated.contactAdditionalNotes),
      ]);
      pushLog(`Tizim sozlamalari yangilandi va botga saqlandi.`);
      triggerToast(`Tizim sozlamalari muvaffaqiyatli saqlandi.`, 'success');
    } catch (err: any) {
      triggerToast(`Sozlamalarni saqlashda xatolik: ${err?.message || err}`, 'error');
    }
  };

  // 10. Dispatch New Trip Handler (faqat mahalliy ko'rinish — safarlar odatda bot orqali yaratiladi)
  const handleDispatchNewTrip = (newTrip: Omit<Trip, 'id' | 'status'>) => {
    const newId = `TRIP-${Math.floor(Math.random() * 9000) + 1000}`;
    const completeTrip: Trip = { ...newTrip, id: newId, status: 'ACTIVE' as const };
    setTrips((prev) => [completeTrip, ...prev]);
    setStats((prev) => ({ ...prev, liveTripsCount: prev.liveTripsCount + 1 }));
    setIsNewDispatchOpen(false);
    pushLog(`Yangi taksi yo'nalishi yo'lga qo'yildi (lokal): #${newId}.`);
    triggerToast(`Yangi qatnov muvaffaqiyatli yo'lga qo'yildi.`, 'success');
  };

  const handleAddOrder = (newOrder: Omit<Order, 'id' | 'status'>) => {
    const newId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
    const completeOrder: Order = { ...newOrder, id: newId, status: 'PENDING' as const };
    setOrders((prev) => [completeOrder, ...prev]);
    setStats((prev) => ({ ...prev, pendingOrdersCount: prev.pendingOrdersCount + 1 }));
    setIsNewDispatchOpen(false);
    pushLog(`Yangi yo'lovchi buyurtma e'loni joylashtirildi (lokal): #${newId}.`);
    triggerToast(`Yangi yo'lovchi e'loni muvaffaqiyatli joylashtirildi!`, 'success');
  };

  // --- Auth holatiga qarab render ---
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLoginSubmit} />;
  }

  return (
    <div className={`min-h-screen bg-background font-sans antialiased text-on-surface ${settings.activeTheme}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewDispatchClick={() => setIsNewDispatchOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main View Area Container */}
      <div className="pl-sidebar-width pt-16 min-h-screen flex flex-col transition-all duration-300">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          settings={settings}
          pendingCount={orders.filter((o) => o.status === 'PENDING').length}
          onNotificationsClick={() => setIsNotificationsPanelOpen(true)}
          onHistoryClick={() => setIsLogsPanelOpen(true)}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Inner Tab Router */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-20">
          {isDataLoading && (
            <div className="mb-4 text-xs text-on-surface-variant">Ma'lumotlar yuklanmoqda...</div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              drivers={drivers}
              onExportClick={() => {
                triggerToast('Ma\'lumotlar paketi tayyorlandi. Yuklab olish boshlandi.', 'success');
                pushLog('Tizim jadvallari CSV formatida eksport qilindi.');
              }}
              onViewAllDriversClick={() => setActiveTab('users')}
            />
          )}

          {activeTab === 'trips' && (
            <TripsView
              trips={trips}
              orders={orders}
              stats={stats}
              searchQuery={searchQuery}
              onCancelTrip={handleCancelTrip}
              onConfirmOrder={handleConfirmOrder}
              onRejectOrder={handleRejectOrder}
              onUpdateTripPrice={handleUpdateTripPrice}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              drivers={drivers}
              passengers={passengers}
              trips={trips}
              searchQuery={searchQuery}
              onBlockUser={handleBlockUser}
              onUpdateBalance={handleUpdateBalance}
            />
          )}

          {activeTab === 'broadcast' && (
            <BroadcastView broadcasts={broadcasts} onSendBroadcast={handleSendBroadcast} />
          )}

          {activeTab === 'blacklist' && (
            <BlacklistView
              blacklist={blacklist}
              searchQuery={searchQuery}
              onUnblockUser={handleUnblockUser}
              onAddToBlacklist={handleAddToBlacklist}
            />
          )}

          {activeTab === 'settings' && <SettingsView settings={settings} onSaveSettings={handleSaveSettings} />}

          {activeTab === 'help' && (
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/40 shadow-sm max-w-3xl space-y-6">
              <h2 className="text-xl font-bold text-on-surface">Yo'riqnomalar va Qo'llab-quvvatlash</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Xorazm Taxi boshqaruv paneliga xush kelibsiz! Ushbu tizim Urganch, Xiva va yaqin tumanlardagi shaharlararo hamda shahar ichidagi taksi yo'nalishlarini real vaqt rejimida boshqarish va muvofiqlashtirish uchun mo'ljallangan.
              </p>
              <div className="space-y-4 pt-4 border-t border-outline-variant/30 text-xs">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">Qatnovlarni boshqarish protokoli</h4>
                    <p className="text-on-surface-variant mt-1">Uzoq masofalarga yangi qatnovlarni yo'lga qo'yishdan oldin biriktirilgan avtotransport vositalarining texnik holati va ruxsatnomalari mavjudligini tekshiring.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">Qora ro'yxat qoidalari</h4>
                    <p className="text-on-surface-variant mt-1">Foydalanuvchini qora ro'yxatdan chiqarish uning tizimdagi faolligini darhol tiklaydi.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Global New Dispatch Modal */}
      {isNewDispatchOpen && (
        <NewDispatchModal
          drivers={drivers}
          passengers={passengers}
          trips={trips}
          onClose={() => setIsNewDispatchOpen(false)}
          onDispatch={handleDispatchNewTrip}
          onAddOrder={handleAddOrder}
        />
      )}

      {/* Floating Operations Audit Logs Flyout Panel */}
      {isLogsPanelOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-inverse-surface text-inverse-on-surface w-full max-w-md h-full flex flex-col shadow-2xl p-6 border-l border-outline/10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary-fixed" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-inverse-on-surface">Tizim terminali jurnali</h3>
              </div>
              <button
                onClick={() => setIsLogsPanelOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container/20 text-outline-variant transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-2.5 font-mono text-[10px] pr-2">
              {auditLogs.map((log, index) => (
                <div key={index} className="p-2.5 bg-[#0e1622] rounded-lg border border-outline/5 text-slate-300 leading-relaxed hover:border-outline/20 hover:text-white transition-colors">
                  {log}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setAuditLogs([`[${new Date().toLocaleTimeString()}] Superuser tomonidan jurnal tozalandi.`]);
                triggerToast('Jurnal tozalandi.', 'info');
              }}
              className="w-full py-3 bg-surface-container-highest/10 hover:bg-surface-container-highest/20 text-inverse-on-surface font-mono text-[10px] rounded-lg cursor-pointer transition-colors border border-outline/10 uppercase font-bold tracking-wider"
            >
              Jurnalni tozalash
            </button>
          </div>
        </div>
      )}

      {/* Floating Live Notifications Dashboard Drawer */}
      {isNotificationsPanelOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-surface-container-lowest w-full max-w-md h-full flex flex-col shadow-2xl p-6 border-l border-outline-variant animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-on-surface">Tizim bildirishnomalari</h3>
              </div>
              <button
                onClick={() => setIsNotificationsPanelOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-1">
              {orders.filter((o) => o.status === 'PENDING').length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/70 gap-3">
                  <CheckCircle2 className="w-12 h-12 text-secondary/45" />
                  <p className="font-bold text-xs">Kutilayotgan buyurtmalar mavjud emas!</p>
                </div>
              ) : (
                orders
                  .filter((o) => o.status === 'PENDING')
                  .map((o) => (
                    <div
                      key={o.id}
                      className="p-4 bg-surface-container/35 rounded-xl border border-outline-variant/30 hover:border-outline-variant/60 transition-all flex flex-col gap-2 group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">{o.passengerName}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{o.passengerPhone}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[9px] font-extrabold uppercase border border-tertiary-container/30">
                          {o.seatsRequested} ta joy
                        </span>
                      </div>

                      <p className="text-[10px] text-on-surface-variant font-medium bg-surface-container px-2.5 py-1.5 rounded-lg border border-outline-variant/10">
                        So'ralayotgan faol qatnov: <span className="font-bold text-on-surface">#{o.tripId}</span>
                      </p>

                      <div className="flex gap-2 pt-1 border-t border-outline-variant/10 mt-1">
                        <button
                          onClick={() => handleConfirmOrder(o.id)}
                          className="flex-1 py-1.5 bg-secondary text-on-secondary font-bold text-[10px] uppercase rounded-lg hover:opacity-95 transition-opacity cursor-pointer text-center"
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => handleRejectOrder(o.id)}
                          className="flex-1 py-1.5 bg-error text-on-error font-bold text-[10px] uppercase rounded-lg hover:opacity-95 transition-opacity cursor-pointer text-center"
                        >
                          Rad etish
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Toast Alert Overlay */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
