import { defineStore } from 'pinia';
import type { Folio, FolioLine, OccupancySnapshot, RatePlan, Reservation } from '../lib/commercialTypes';
import {
  fetchAvailabilityCalendar,
  fetchFolio,
  fetchOccupancyToday,
  fetchRatePlans,
  fetchReservations,
} from '../lib/commercialApi';
import {
  mockAvailabilityWeek,
  mockFolio,
  mockOccupancyToday,
  mockRatePlans,
  mockReservations,
} from '../lib/mockCommercialData';
import { getErrorMessage } from '../lib/errors';

export const useCommercialStore = defineStore('commercial', {
  state: () => ({
    reservations: [...mockReservations] as Reservation[],
    ratePlans: [...mockRatePlans] as RatePlan[],
    folio: { ...mockFolio } as Folio,
    occupancyToday: { ...mockOccupancyToday } as OccupancySnapshot,
    availabilityWeek: [...mockAvailabilityWeek] as OccupancySnapshot[],
    loading: false,
    error: '',
  }),
  actions: {
    async refreshAll() {
      this.loading = true;
      this.error = '';
      const results = await Promise.allSettled([
        fetchReservations(),
        fetchRatePlans(),
        fetchOccupancyToday(),
        fetchAvailabilityCalendar(),
      ]);

      const [reservationsRes, ratesRes, occupancyRes, calendarRes] = results;

      if (reservationsRes.status === 'fulfilled') {
        this.reservations = reservationsRes.value.data;
      }
      if (ratesRes.status === 'fulfilled') {
        this.ratePlans = ratesRes.value.data;
      }
      if (occupancyRes.status === 'fulfilled') {
        this.occupancyToday = occupancyRes.value.data;
      }
      if (calendarRes.status === 'fulfilled') {
        this.availabilityWeek = calendarRes.value.data;
      }

      if (results.some((r) => r.status === 'rejected')) {
        this.error = 'No se pudo actualizar la vista comercial.';
      }

      this.loading = false;
    },
    async loadFolio(reservationId: string) {
      try {
        const response = await fetchFolio(reservationId);
        this.folio = response.data;
      } catch (error: unknown) {
        this.error = getErrorMessage(error, 'No se pudo cargar el folio');
      }
    },
    addReservation(payload: Omit<Reservation, 'id'>) {
      const id = `res-${Math.random().toString(36).slice(2, 9)}`;
      this.reservations = [{ ...payload, id }, ...this.reservations];
    },
    addRatePlan(payload: Omit<RatePlan, 'id'>) {
      const id = `rate-${Math.random().toString(36).slice(2, 9)}`;
      this.ratePlans = [{ ...payload, id }, ...this.ratePlans];
    },
    addFolioCharge(payload: Omit<FolioLine, 'id'>) {
      const id = `line-${Math.random().toString(36).slice(2, 9)}`;
      this.folio.lines = [...this.folio.lines, { ...payload, id }];
      this.folio.total = this.folio.lines.reduce((sum, line) => sum + line.amount, 0);
    },
  },
});
