/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Django REST API javoblarini (snake_case, bot maydon nomlari) frontend
// komponentlari kutadigan types.ts interfeyslariga o'giradi. Shu qatlam
// tufayli mavjud komponentlar (DashboardView, TripsView, ...) o'zgarishsiz
// qoladi — ular qayerdan kelganidan qat'i nazar bir xil shaklni ko'radi.

import { Driver, Passenger, Trip, Order, Broadcast, BlacklistUser } from './types';

function initialsOf(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || '??';
}

const UZ_MONTHS_SHORT = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

export function formatUzShortDate(d: Date): string {
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = UZ_MONTHS_SHORT[d.getMonth()];
  return `${day} ${month}`;
}

export function formatUzLongDate(d: Date): string {
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} ${UZ_MONTHS_SHORT[d.getMonth()]}, ${d.getFullYear()}`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    const safeIso = iso.replace(' ', 'T');
    return formatUzLongDate(new Date(safeIso));
  } catch {
    return iso;
  }
}

function formatDateTime(iso?: string): string {
  if (!iso) return '';
  try {
    const safeIso = iso.replace(' ', 'T');
    const d = new Date(safeIso);
    return formatUzShortDate(d) + ', ' +
      d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function mapUserToDriver(u: any): Driver {
  return {
    id: String(u.telegram_id),
    name: u.fullname || `Haydovchi #${u.telegram_id}`,
    phone: u.phone || '',
    photoUrl: '',
    vehicleModel: u.car_type || "Noma'lum",
    licensePlate: u.car_number || '-',
    rating: 0,
    tripsCompleted: 0,
    earnings: 0,
    vehicleColor: '',
    device: '',
    registrationDate: formatDate(u.created_at),
    status: u.status === 'banned' ? 'Offline' : 'Active',
  };
}

export function mapUserToPassenger(u: any): Passenger {
  return {
    id: String(u.telegram_id),
    name: u.fullname || `Yo'lovchi #${u.telegram_id}`,
    photoUrl: '',
    initials: initialsOf(u.fullname),
    phone: u.phone || '',
    telegramUsername: '',
    telegramId: String(u.telegram_id),
    balance: u.balance || 0,
    status: u.status === 'banned' ? 'Banned' : 'Active',
    joinedDate: formatDate(u.created_at),
    device: '',
    totalTrips: 0,
  };
}

export function mapApiTrip(t: any, usersById: Map<string, any>): Trip {
  const driver = usersById.get(String(t.driver));
  const departure = t.departure_time ? new Date(t.departure_time) : null;
  const statusMap: Record<string, Trip['status']> = {
    active: 'ACTIVE',
    departed: 'ACTIVE',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
  };
  return {
    id: String(t.id),
    driverId: String(t.driver),
    driverName: t.driver_name || driver?.fullname || '',
    vehicleModel: t.car_type || '',
    licensePlate: driver?.car_number || '-',
    driverPhoto: '',
    routeStart: t.from_district,
    routeEnd: t.to_district,
    emptySeats: t.seats_available,
    price: t.price,
    departureDay: departure ? formatUzShortDate(departure) : '',
    departureTime: departure ? departure.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : '',
    status: statusMap[t.status] || 'ACTIVE',
  };
}

export function mapApiOrder(o: any): Order {
  const statusMap: Record<string, Order['status']> = {
    pending: 'PENDING',
    confirmed: 'CONFIRMED',
    cancelled: 'REJECTED',
  };
  return {
    id: String(o.id),
    passengerName: o.passenger_name || `Yo'lovchi #${o.passenger}`,
    passengerPhone: o.passenger_phone || '',
    passengerInitials: initialsOf(o.passenger_name),
    tripId: String(o.trip),
    seatsRequested: o.seats_count,
    dateTime: formatDateTime(o.created_at),
    status: statusMap[o.status] || 'PENDING',
  };
}

const ROLE_LABELS: Record<string, string> = {
  all: 'All Users',
  driver: 'Drivers Only',
  passenger: 'Passengers Only',
};

export function mapApiBroadcast(b: any): Broadcast {
  const statusMap: Record<string, Broadcast['status']> = {
    pending: 'Sending',
    sending: 'Sending',
    completed: 'Completed',
    failed: 'Failed',
  };
  return {
    id: String(b.id),
    title: b.title,
    targetAudience: ROLE_LABELS[b.target_role] || 'All Users',
    districtFilter: b.target_district || 'All Xorazm Districts',
    messageContent: b.message,
    status: statusMap[b.status] || 'Sending',
    sentCount: b.status === 'completed' ? 1 : 0,
    totalCount: 1,
    timestamp: formatDateTime(b.sent_at || b.created_at),
    dateStr: formatDate(b.created_at),
    audienceCountText: ROLE_LABELS[b.target_role] || 'All Users',
    districtText: b.target_district || 'All Districts',
  };
}

export function mapApiBlacklist(b: any): BlacklistUser {
  const created = b.created_at ? new Date(b.created_at) : new Date();
  return {
    id: String(b.id),
    name: b.phone || (b.telegram_id ? `Telegram ID: ${b.telegram_id}` : `Qora ro'yxat #${b.id}`),
    photoUrl: '',
    initials: '??',
    telegramId: b.telegram_id ? String(b.telegram_id) : '',
    telegramUsername: '',
    phone: b.phone || '',
    reason: b.reason || '',
    date: formatUzLongDate(created),
    time: created.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    type: 'Doimiy',
    originalRole: 'Passenger',
  };
}
