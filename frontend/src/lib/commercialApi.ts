import api from './api';
import type { Folio, OccupancySnapshot, RatePlan, Reservation } from './commercialTypes';

type CalendarResponse = OccupancySnapshot[];

type ReservationsResponse = Reservation[];

type RatesResponse = RatePlan[];

type FolioResponse = Folio;

type OccupancyResponse = OccupancySnapshot;

export async function fetchReservations() {
  return api.get<ReservationsResponse>('/reservations');
}

export async function fetchRatePlans() {
  return api.get<RatesResponse>('/rates');
}

export async function fetchFolio(reservationId: string) {
  return api.get<FolioResponse>(`/folios/${reservationId}`);
}

export async function fetchOccupancyToday() {
  return api.get<OccupancyResponse>('/reports/occupancy/today');
}

export async function fetchAvailabilityCalendar() {
  return api.get<CalendarResponse>('/reports/occupancy/week');
}
