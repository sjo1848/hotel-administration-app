export type ReservationStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';

export type Reservation = {
  id: string;
  guestName: string;
  roomType: string;
  roomNumber?: string | null;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  total: number;
};

export type RatePlan = {
  id: string;
  name: string;
  roomType: string;
  price: number;
  currency: string;
  refundable: boolean;
};

export type FolioLine = {
  id: string;
  description: string;
  amount: number;
};

export type Folio = {
  reservationId: string;
  guestName: string;
  lines: FolioLine[];
  total: number;
};

export type OccupancySnapshot = {
  date: string;
  occupancyRate: number;
  roomsAvailable: number;
  roomsOccupied: number;
};
