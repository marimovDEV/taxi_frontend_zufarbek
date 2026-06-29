/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, Passenger, Trip, Order, Broadcast, BlacklistUser, SystemStats, AppSettings } from './types';

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Azizbek Rakhimov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv_E8K-TDEf077V5bLfc_iUJ2-yrQYquCi-HQS_W5zrkp0mtQGQNOYbZHMR6GII7ergScZwS06tMeX-duiFNya_eUuerpyi7g-LufpToH_ZED9z3AqZbeqFOSHrr4eB8MwCUtLt2nOI0MRPm1bifZKs3bPtmrymZ7QBM94eLyTQFutBzromilKxHDUonLvzINkR4t_uL9bHR_N7vn3avoumPB3CaQeJbO8hwDyA0HZ2hS0j0J2XXoOeg',
    vehicleModel: 'White Chevrolet Nexia 3',
    licensePlate: '90 | A 248 RA',
    rating: 4.95,
    tripsCompleted: 248,
    earnings: 12450000,
    vehicleColor: 'White Pearl',
    device: 'Android RedMi Note 12',
    registrationDate: '12 Jan, 2023',
    status: 'Active'
  },
  {
    id: 'DRV-002',
    name: 'Murod Sobirov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOVO38f52HvAmoZE0Xjp9lwcukKKwYkxAFUyhnPWeN3pm3Ik_lK7c8zeKgkZX_LgQRZvHs1U9uPfYXt3GiPllxbFYabPbpxSNu9_hNacgjfHjej5rcp-Fgy-VEABk-rCUc_XUyP_WEdWh4JRXlYDE983IB4UPGx3NT4OwiYA0rdox5S55jrJ2oHRhvUic2oFkzlfqYYudZb9HT21Bh9LaBPt6un6T6qPKBT3cAX-TmlNAwdBvXhdpI0g',
    vehicleModel: 'Silver Cobalt',
    licensePlate: '90 | X 215 SA',
    rating: 4.88,
    tripsCompleted: 215,
    earnings: 10820000,
    vehicleColor: 'Silver Metallic',
    device: 'Samsung Galaxy A54',
    registrationDate: '03 Feb, 2023',
    status: 'Active'
  },
  {
    id: 'DRV-003',
    name: 'Javohir Karimov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNB1uYxuKVCc4fzRAHiF3F8zaFRdpB_519CdlBXxaCQP3tZl7Px42klY-UJZjbtq_ZjRzI41UF8VtAO37jh--5g9sjHk-7irUGVuy5avG9GTNsYENrgz3qF1Z4pYCi6f51Tx7TnnHkVjr31hol0A6xuyBwws4sahpOgFeO7ZF9VdOYIwHpjNkIzBttLqloWXiuT5I4G0YFUCQXB2hsh7yWyrnOtA7-pOKHfzmF76L0F5G9-Ed-QpsryQ',
    vehicleModel: 'Black Gentra',
    licensePlate: '90 | Z 194 AA',
    rating: 4.82,
    tripsCompleted: 194,
    earnings: 9600000,
    vehicleColor: 'Glossy Black',
    device: 'Xiaomi Poco F5',
    registrationDate: '22 Mar, 2023',
    status: 'Active'
  },
  {
    id: 'DRV-004',
    name: 'Rustam Olimov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBetj7yQyKc0p_qkN2TYKOFyAeEpwA3_jXyPjAYeE58m2dXGTIcx5mAk-Qdm5L_0euMIIkW97DrRuCm0yUZ0LFvgMo1QuaN8pk3c5YUlmXUjwepLDPMXkoKVBjH4kqJ97HQjcoOvFNnkhGPGo_ORdGW7YHAHsapr1NY2Wxi18-VGb-3E4IYlO0aSpBhNOwZYtNosTJQlshtjGAIwnW1mBgFZw6xeI6CvWsKmQ07C-4G3z6LbE3RDq9d4w',
    vehicleModel: 'Blue Lacetti',
    licensePlate: '90 | O 182 BB',
    rating: 4.80,
    tripsCompleted: 182,
    earnings: 8950000,
    vehicleColor: 'Ocean Blue',
    device: 'Realme 11 Pro',
    registrationDate: '01 May, 2023',
    status: 'Active'
  },
  {
    id: 'DRV-005',
    name: 'Azamat Karimov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZrTjqGoO2AJcSdDehHo_jI0VzsamJ_6arIDTQgJJ0Rjhuwu7cKDeuuRwuqoa_5unJz9FuUqk8OB2h8TGB_6ZKO-sd6_rjrekPhvKy53dqEzISPaXLKSsYEQPWhgWcDPokYOcH8lcwZ9pxg-DZ0B-G-UXmJYnMju9k3BA31W1p-SyfNtCbm3yoWvSFuRHDuvB6pyxebbPTz_GqEhx-y27R1IMuiroe4zISG3uSfF-Gz9Du_82dKL81EA',
    vehicleModel: 'Chevrolet Gentra',
    licensePlate: '90 | A 777 BA',
    rating: 4.98,
    tripsCompleted: 1450,
    earnings: 45000000,
    vehicleColor: 'Pearl White',
    device: 'iPhone 14 Pro',
    registrationDate: '15 Oct, 2022',
    status: 'Active'
  },
  {
    id: 'DRV-006',
    name: 'Shokir Bekov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuD6qyaamxMJMbJoMpNYNwxQ70TnG86UbQomNtJjJwgeDXYcGGRz1oOKB4IsXF0t3Dm4jpnrhVPXoNSy5ys92bCg82Mw5Lj8d6oSRNWWzpp78Fai2p2JnqGt-CZBI7EVECirFa8grAvbQmupIcUwi7qNzDeWhmWbiV_s-S_QbovMGxgCox8HTbmcNPHMxRUkl5L5mSgjAjPw3KVhBUjkHGFHlYZszb049OEkJ0jFUvij9Lw9uSNgaTwA',
    vehicleModel: 'Chevrolet Cobalt',
    licensePlate: '90 | X 123 AA',
    rating: 4.75,
    tripsCompleted: 852,
    earnings: 28400000,
    vehicleColor: 'Silver Gray',
    device: 'Samsung S21 FE',
    registrationDate: '18 Nov, 2022',
    status: 'Active'
  },
  {
    id: 'DRV-007',
    name: 'Jasur Aliev',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiUDHAXulchvUVa7L58LCwVvAeHtAjpCZk6ZWCglsxLhy9BGKFioRTCispRVZQnvPE6zOX3W4Y22mc7xEzWhOIfK83tzfnBQO7KnO_zgm4GiAkFdkfiJBoF6ckM52503DtCWFEvKrVKSVu6uRUrGKC-JuXScaeP3oHUAWjzHUsjRZTe3qwAcFQEeXD2nUAogBO9cTZJeRFr_5O2wxLNu5GUqz7dm6UtYxHOZXto43FWC2pS25pFKzNPQ',
    vehicleModel: 'Chevrolet Malibu 2',
    licensePlate: '90 | Z 001 ZZ',
    rating: 4.90,
    tripsCompleted: 312,
    earnings: 18500000,
    vehicleColor: 'Glossy Black',
    device: 'iPhone 15 Pro Max',
    registrationDate: '01 Mar, 2023',
    status: 'Active'
  }
];

export const INITIAL_PASSENGERS: Passenger[] = [
  {
    id: 'PSG-001',
    name: 'Nigora Juraeva',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjw95Les204ApRMFSyEs_8GJYTZmGnC0rhzdKXgodGUl5pUt6_j3c5uCGLd849zw2etulPbDv7Q89wDeODghditLPtJZeSiJ2e0kv40mfG1wKdXhnVLVSMAUeuv2FXotCd8e1HM3b5S0DPlbSl8ltomhBsTYkf_QgO7DamHFaWsc9OqYmTGKe17Mc2PFyd6dcVAMe9ZEOnNp1FMQsg1jHg8NUbtZxOJzfy7JbDglCDX-DszMHYJqmqbw',
    initials: 'NJ',
    phone: '+998 91 555 12 34',
    telegramUsername: '@nigora_j',
    telegramId: '882341102',
    balance: 15000,
    status: 'Active',
    joinedDate: '12 Nov, 2023',
    device: 'Samsung Galaxy S22 Ultra',
    totalTrips: 45
  },
  {
    id: 'PSG-002',
    name: 'Sardor Atayev',
    initials: 'SA',
    phone: '+998 99 456 12 34',
    telegramUsername: '@sardor_ata',
    telegramId: '912344101',
    balance: 85000,
    status: 'Active',
    joinedDate: '20 Oct, 2023',
    device: 'Redmi Note 11',
    totalTrips: 18
  },
  {
    id: 'PSG-003',
    name: 'Malika Karimova',
    initials: 'MK',
    phone: '+998 90 123 45 67',
    telegramUsername: '@malika_k',
    telegramId: '772399104',
    balance: 120000,
    status: 'Active',
    joinedDate: '15 Sep, 2023',
    device: 'iPhone 13',
    totalTrips: 34
  },
  {
    id: 'PSG-004',
    name: 'Aziz Khovilov',
    initials: 'AK',
    phone: '+998 90 123 45 67',
    telegramUsername: '@aziz_khovilov',
    telegramId: '652312987',
    balance: 420000,
    status: 'Active',
    joinedDate: '24 Oct, 2023',
    device: 'iPhone 14 Pro',
    totalTrips: 1240
  },
  {
    id: 'PSG-005',
    name: 'Umid Mirzo',
    initials: 'UM',
    phone: '+998 94 999 88 77',
    telegramUsername: '@umid_m',
    telegramId: '452119023',
    balance: -45000,
    status: 'Banned',
    joinedDate: '05 Aug, 2023',
    device: 'Redmi 10',
    totalTrips: 12
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'TRIP-9902',
    driverId: 'DRV-005',
    driverName: 'Azamat Karimov',
    vehicleModel: 'Chevrolet Gentra',
    licensePlate: '90 | A 777 BA',
    driverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZrTjqGoO2AJcSdDehHo_jI0VzsamJ_6arIDTQgJJ0Rjhuwu7cKDeuuRwuqoa_5unJz9FuUqk8OB2h8TGB_6ZKO-sd6_rjrekPhvKy53dqEzISPaXLKSsYEQPWhgWcDPokYOcH8lcwZ9pxg-DZ0B-G-UXmJYnMju9k3BA31W1p-SyfNtCbm3yoWvSFuRHDuvB6pyxebbPTz_GqEhx-y27R1IMuiroe4zISG3uSfF-Gz9Du_82dKL81EA',
    routeStart: 'Urgench',
    routeEnd: 'Tashkent',
    emptySeats: 2,
    price: 250000,
    departureDay: 'Today',
    departureTime: '22:45',
    status: 'ACTIVE'
  },
  {
    id: 'TRIP-9903',
    driverId: 'DRV-006',
    driverName: 'Shokir Bekov',
    vehicleModel: 'Cobalt',
    licensePlate: '90 | X 123 AA',
    driverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuD6qyaamxMJMbJoMpNYNwxQ70TnG86UbQomNtJjJwgeDXYcGGRz1oOKB4IsXF0t3Dm4jpnrhVPXoNSy5ys92bCg82Mw5Lj8d6oSRNWWzpp78Fai2p2JnqGt-CZBI7EVECirFa8grAvbQmupIcUwi7qNzDeWhmWbiV_s-S_QbovMGxgCox8HTbmcNPHMxRUkl5L5mSgjAjPw3KVhBUjkHGFHlYZszb049OEkJ0jFUvij9Lw9uSNgaTwA',
    routeStart: 'Khiva',
    routeEnd: 'Bukhara',
    emptySeats: 4,
    price: 120000,
    departureDay: 'Tomorrow',
    departureTime: '08:00',
    status: 'COMPLETED'
  },
  {
    id: 'TRIP-9904',
    driverId: 'DRV-007',
    driverName: 'Jasur Aliev',
    vehicleModel: 'Malibu 2',
    licensePlate: '90 | Z 001 ZZ',
    driverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiUDHAXulchvUVa7L58LCwVvAeHtAjpCZk6ZWCglsxLhy9BGKFioRTCispRVZQnvPE6zOX3W4Y22mc7xEzWhOIfK83tzfnBQO7KnO_zgm4GiAkFdkfiJBoF6ckM52503DtCWFEvKrVKSVu6uRUrGKC-JuXScaeP3oHUAWjzHUsjRZTe3qwAcFQEeXD2nUAogBO9cTZJeRFr_5O2wxLNu5GUqz7dm6UtYxHOZXto43FWC2pS25pFKzNPQ',
    routeStart: 'Urgench',
    routeEnd: 'Nukus',
    emptySeats: 0,
    price: 80000,
    departureDay: 'Oct 24',
    departureTime: '14:30',
    status: 'CANCELLED'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5541',
    passengerName: 'Sardor Atayev',
    passengerPhone: '+998 99 456 12 34',
    passengerInitials: 'SA',
    tripId: 'TRIP-9902',
    seatsRequested: 1,
    dateTime: 'Oct 24, 09:12',
    status: 'PENDING'
  },
  {
    id: 'ORD-5542',
    passengerName: 'Malika Karimova',
    passengerPhone: '+998 90 123 45 67',
    passengerInitials: 'MK',
    tripId: 'TRIP-9902',
    seatsRequested: 2,
    dateTime: 'Oct 23, 21:45',
    status: 'CONFIRMED'
  }
];

export const INITIAL_BROADCASTS: Broadcast[] = [
  {
    id: 'BRD-001',
    title: 'Fuel Price Adjustment Notice',
    targetAudience: 'Drivers Only',
    districtFilter: 'Urgench City',
    messageContent: 'Hurmatli haydovchilar! Yoqilg\'i narxi o\'zgarganligi munosabati bilan, Urgench shahar ichidagi minimal buyurtma tarifi 8,000 so\'mdan 10,000 so\'mga ko\'tarildi. Tafsilotlar ilovaning yangi tahririda taqdim etilgan.',
    status: 'Completed',
    sentCount: 4502,
    totalCount: 4502,
    timestamp: '2h ago',
    dateStr: '25 Jun, 2026',
    audienceCountText: '4,502 Drivers',
    districtText: 'Urgench'
  },
  {
    id: 'BRD-002',
    title: 'Holiday Discount Voucher',
    targetAudience: 'All Users',
    districtFilter: 'All Xorazm Districts',
    messageContent: 'Qurbon Hayiti munosabati bilan barcha yo\'lovchilarga 15% gacha chegirmali vaucherlar taqdim etiladi! Kod: HAYIT2026',
    status: 'Failed',
    sentCount: 12450,
    totalCount: 25000,
    timestamp: 'Yesterday',
    dateStr: '24 Jun, 2026',
    audienceCountText: '25,000 Users',
    districtText: 'All Districts',
    errorReason: 'Server Error (Notification gateway timeout)'
  },
  {
    id: 'BRD-003',
    title: 'App Update Required',
    targetAudience: 'All Users',
    districtFilter: 'All Xorazm Districts',
    messageContent: 'Ilovani barqaror ishlashi va xavfsizlik yangilanishlarini olish uchun tez fursatda 4.2.1 versiyasiga yangilang. Eski tahrirlar 1-iyuldan to\'xtatiladi.',
    status: 'Completed',
    sentCount: 32100,
    totalCount: 32100,
    timestamp: '24 Dec',
    dateStr: '24 Dec, 2025',
    audienceCountText: '32,100 Users',
    districtText: 'All Districts'
  }
];

export const INITIAL_BLACKLIST: BlacklistUser[] = [
  {
    id: 'BL-001',
    name: 'Farrux Ergashev',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBLffPWGNwEsqaFuofvz4J2TI8aLqaSZaZHwJJQEhzbGSgkLQwRt_ZVJp3QHEMc95XlCV2bz8TbiRZPM9ftBzDICWs_dgtFKY48L23P_bnq15i2v3Rc0sxPHDCCrIdD-2Ud6RjHEaxKIzAm7cCLcUF3On1kLEN9l5SIJLHVUHrBXE-_LlLNK5M4lMSvnSnVhVk5NsGi8pzB9e5ikO1nZQRbxglOHiphtBGiT3i8gtKHEIZxDq3mJJQQg',
    initials: 'FE',
    telegramId: '982341203',
    telegramUsername: '@f_ergash_77',
    phone: '+998 (90) 123-45-67',
    reason: 'To\'lovdan bo\'yin tovlash (3 marta buyurtma to\'lanmagan)',
    date: '12 May, 2024',
    time: '14:30',
    type: 'Doimiy',
    originalRole: 'Passenger'
  },
  {
    id: 'BL-002',
    name: 'Zilola Karimova',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMQG1z8-TU3BT0irtwwZEVRg3jPQW8kdyhpbonzttQeBr8NewEEh04MljPcVe_RblVBs10fFzGC_Wh6esVSkIUtF2LuGuD4UA5zukAOP7Dbu-BA5ci8jrJ2zPvD17cMmSJ6n4T4Q8TZn945WWD6tbl12e4ImyI-72ZaqqBgzNV1zerr7IpoQe6B0WpZ6OU_QuSVJeMhjKOEjBWXEOYGmlFmm08vxdeBJ5-LscfruFS3CTt2eTjUQfDaw',
    initials: 'ZK',
    telegramId: '552399104',
    telegramUsername: '@zilola_k',
    phone: '+998 (99) 887-66-55',
    reason: 'Haydovchiga nisbatan asossiz haqorat va qo\'pol munosabat',
    date: '10 May, 2024',
    time: '09:15',
    type: 'Vaqtincha',
    originalRole: 'Passenger'
  },
  {
    id: 'BL-003',
    name: 'Azizbek Sodiqov',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_DkojBXLnp4j_LK8ZBnzv8VVRV5mOJqgl1AjU-W7FuTwybyAg63VoU0MbyINLP2o2mivWcPYoAGNC0bHl6GIdThMledTjr0ivw1OrjxmW1DTzIa3R286SOmOelyE05_woomg5BCeXaXypBiYrdANNRRqPUb0OZZ3eelu0_G1qgZPL3pABEQe7Cy0ASrOk6WHJ3mkXEP3IXCGm7DB24R_q5i4PKsKhwsKIhQSRMYiDIEQOjxzimm_9A',
    initials: 'AS',
    telegramId: '112009873',
    telegramUsername: '@aziz_s_88',
    phone: '+998 (93) 444-33-22',
    reason: 'Soxta buyurtmalar (Spam bot orqali ko\'plab yolg\'on chaqiruvlar)',
    date: '05 May, 2024',
    time: '22:05',
    type: 'Doimiy',
    originalRole: 'Driver'
  }
];

export const INITIAL_STATS: SystemStats = {
  liveTripsCount: 42,
  pendingOrdersCount: 156,
  seatUtilization: 78,
  volumeToday: 4200000, // UZS
  totalUsersCount: 24582,
  activeDriversCount: 1842,
  systemBalance: 14200000, // UZS
  bannedUsersCount: 84
};

export const INITIAL_SETTINGS: AppSettings = {
  tariffPerKm: 2500,
  commissionFee: 10, // 10% admin fee
  systemStatus: 'Healthy',
  activeTheme: 'light',
  smsProvider: 'Eskiz SMS API',
  smsApiKey: 'esk_key_a8d7cb1209ff7bc876',
  telegramBotToken: '8804658448:AAHWvNoidCXx6JmMkszPbYzVON88PFC9yRk',
  telegramBotUsername: '@hazgo_taxi_bot',
  telegramBotName: 'HAZGO TAXI',
  contactSectionTitle: 'Aloqa bo\'limi',
  contactPhone: '+998991234567',
  contactTelegramUsername: '@hazgo_taxi_bot',
  contactAdditionalNotes: 'Tizim faqat Xorazm tumanlari uchun ishlaydi.',
  lastSavedTime: '22:45:30'
};

export const HIGH_TRAFFIC_ROUTES = [
  {
    id: 'route-1',
    start: 'Urganch markaziy vokzali',
    end: 'Xiva Ichan-Qal\'a',
    tripsCountText: '1.2k qatnov',
    percentage: 85
  },
  {
    id: 'route-2',
    start: 'Urganch aeroporti (UGC)',
    end: 'Shahar markazidagi mehmonxonalar',
    tripsCountText: '942 qatnov',
    percentage: 72
  },
  {
    id: 'route-3',
    start: 'Markaziy bozor (Dehqon bozori)',
    end: 'Gurlan tumani markazi',
    tripsCountText: '856 qatnov',
    percentage: 65
  },
  {
    id: 'route-4',
    start: 'TUP shifoxonasi hududi',
    end: 'Turar-joy dahalari',
    tripsCountText: '530 qatnov',
    percentage: 48
  }
];

export const SYSTEM_HEALTH_ITEMS = [
  {
    id: 'h1',
    name: 'Ma\'lumotlar bazasi (PostgreSQL)',
    status: 'Healthy',
    details: '99.9% Uptime • 24ms kechikish'
  },
  {
    id: 'h2',
    name: 'Telegram API',
    status: 'Healthy',
    details: 'Ulanish o\'rnatilgan • Vebxuk faol'
  },
  {
    id: 'h3',
    name: 'Redis kesh xizmati',
    status: 'Healthy',
    details: '0.4s Serialization • 2.4GB/s'
  },
  {
    id: 'h4',
    name: 'Vazifalar rejalashtiruvchisi',
    status: 'Healthy',
    details: '3 ta faol vazifa • Xatolik yo\'q'
  }
];
