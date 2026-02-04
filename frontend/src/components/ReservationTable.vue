<script setup lang="ts">
import type { Reservation } from '../lib/commercialTypes';

defineProps<{
  reservations: Reservation[];
  onCreate: () => void;
}>();

const statusLabels: Record<Reservation['status'], string> = {
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'In-house',
  CHECKED_OUT: 'Salida',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No-show',
};

const statusClasses: Record<Reservation['status'], string> = {
  CONFIRMED: 'status-pill status-pill-confirmed',
  CHECKED_IN: 'status-pill status-pill-inhouse',
  CHECKED_OUT: 'status-pill status-pill-out',
  CANCELLED: 'status-pill status-pill-cancelled',
  NO_SHOW: 'status-pill status-pill-noshow',
};
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-hotel-cream">Reservas activas</h3>
        <p class="text-sm text-white/60">Planificación y arrivals de la semana.</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary">Exportar</button>
        <button class="btn-primary" @click="onCreate">Nueva reserva</button>
      </div>
    </div>
    <div class="table-shell">
      <table class="w-full text-sm">
        <thead class="text-white/60">
          <tr class="text-left">
            <th class="py-2">Huésped</th>
            <th class="py-2">Tipo</th>
            <th class="py-2">Check-in</th>
            <th class="py-2">Check-out</th>
            <th class="py-2">Estado</th>
            <th class="py-2 text-right">Total</th>
            <th class="py-2 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.id" class="table-row">
            <td class="py-3">{{ reservation.guestName }}</td>
            <td class="py-3">{{ reservation.roomType }}</td>
            <td class="py-3">{{ reservation.checkInDate }}</td>
            <td class="py-3">{{ reservation.checkOutDate }}</td>
            <td class="py-3">
              <span :class="statusClasses[reservation.status]">
                {{ statusLabels[reservation.status] }}
              </span>
            </td>
            <td class="py-3 text-right">${{ reservation.total }}</td>
            <td class="py-3 text-right">
              <button class="btn-ghost">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
