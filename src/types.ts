/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  vehicleModel: string;
  licensePlate: string;
  rating: number;
  tripsCompleted: number;
  earnings: number; // in UZS (e.g. 12450000)
  vehicleColor: string;
  device: string;
  registrationDate: string;
  status: 'Active' | 'Offline';
}

export interface Passenger {
  id: string;
  name: string;
  photoUrl?: string;
  initials: string;
  phone: string;
  telegramUsername: string;
  telegramId: string;
  balance: number; // in UZS
  status: 'Active' | 'Banned';
  joinedDate: string;
  device: string;
  totalTrips: number;
}

export interface Trip {
  id: string;
  driverId: string; // reference to driver
  driverName: string;
  vehicleModel: string;
  licensePlate: string;
  driverPhoto: string;
  routeStart: string;
  routeEnd: string;
  emptySeats: number;
  price: number; // in UZS
  departureDay: string; // e.g. "Today" or "Tomorrow" or "Oct 24"
  departureTime: string; // e.g. "22:45"
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface Order {
  id: string;
  passengerName: string;
  passengerPhone: string;
  passengerInitials: string;
  tripId: string;
  seatsRequested: number;
  dateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

export interface Broadcast {
  id: string;
  title: string;
  targetAudience: string;
  districtFilter: string;
  messageContent: string;
  status: 'Sending' | 'Completed' | 'Failed';
  sentCount: number;
  totalCount: number;
  timestamp: string; // e.g. "2h ago", "Yesterday"
  dateStr: string;
  audienceCountText: string;
  districtText: string;
  errorReason?: string;
}

export interface BlacklistUser {
  id: string;
  name: string;
  photoUrl?: string;
  initials: string;
  telegramId: string;
  telegramUsername: string;
  phone: string;
  reason: string;
  date: string;
  time: string;
  type: 'Doimiy' | 'Vaqtincha';
  originalRole: 'Driver' | 'Passenger';
}

export interface SystemStats {
  liveTripsCount: number;
  pendingOrdersCount: number;
  seatUtilization: number;
  volumeToday: number;
  totalUsersCount: number;
  activeDriversCount: number;
  systemBalance: number;
  bannedUsersCount: number;
}

export interface AppSettings {
  tariffPerKm: number;
  commissionFee: number; // e.g. 10
  systemStatus: 'Healthy' | 'Maintenance' | 'Warning';
  activeTheme: 'light' | 'dark';
  smsProvider: string;
  smsApiKey: string;
  telegramBotToken: string;
  telegramBotUsername: string;
  telegramBotName: string;
  contactSectionTitle: string;
  contactPhone: string;
  contactTelegramUsername: string;
  contactAdditionalNotes: string;
  lastSavedTime: string;
}
