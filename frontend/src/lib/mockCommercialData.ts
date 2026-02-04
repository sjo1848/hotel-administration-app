import type { Folio, OccupancySnapshot, RatePlan, Reservation } from './commercialTypes';

export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    guestName: 'Camila Torres',
    roomType: 'Suite',
    roomNumber: '402',
    checkInDate: '2026-02-05',
    checkOutDate: '2026-02-08',
    status: 'CONFIRMED',
    total: 780,
  },
  {
    id: 'res-2',
    guestName: 'Lucas Diaz',
    roomType: 'Doble',
    roomNumber: '210',
    checkInDate: '2026-02-03',
    checkOutDate: '2026-02-06',
    status: 'CHECKED_IN',
    total: 420,
  },
];

export const mockRatePlans: RatePlan[] = [
  { id: 'rate-1', name: 'Best Flexible', roomType: 'Suite', price: 260, currency: 'USD', refundable: true },
  { id: 'rate-2', name: 'Advance Saver', roomType: 'Doble', price: 140, currency: 'USD', refundable: false },
];

export const mockFolio: Folio = {
  reservationId: 'res-2',
  guestName: 'Lucas Diaz',
  total: 420,
  lines: [
    { id: 'line-1', description: 'Noche 1 - Doble', amount: 140 },
    { id: 'line-2', description: 'Noche 2 - Doble', amount: 140 },
    { id: 'line-3', description: 'Noche 3 - Doble', amount: 140 },
  ],
};

export const mockOccupancyToday: OccupancySnapshot = {
  date: '2026-02-03',
  occupancyRate: 78,
  roomsAvailable: 12,
  roomsOccupied: 42,
};

export const mockAvailabilityWeek: OccupancySnapshot[] = [
  { date: '02/03', occupancyRate: 78, roomsAvailable: 12, roomsOccupied: 42 },
  { date: '02/04', occupancyRate: 72, roomsAvailable: 16, roomsOccupied: 38 },
  { date: '02/05', occupancyRate: 81, roomsAvailable: 10, roomsOccupied: 44 },
  { date: '02/06', occupancyRate: 85, roomsAvailable: 8, roomsOccupied: 46 },
  { date: '02/07', occupancyRate: 67, roomsAvailable: 18, roomsOccupied: 36 },
  { date: '02/08', occupancyRate: 62, roomsAvailable: 21, roomsOccupied: 33 },
  { date: '02/09', occupancyRate: 70, roomsAvailable: 15, roomsOccupied: 39 },
];
