<script setup lang="ts">
import type { OccupancySnapshot } from '../lib/commercialTypes';

defineProps<{
  snapshots: OccupancySnapshot[];
}>();

const occupancyTone = (rate: number) => {
  if (rate >= 85) return 'calendar-cell calendar-high';
  if (rate >= 70) return 'calendar-cell calendar-mid';
  return 'calendar-cell calendar-low';
};
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-hotel-cream">Calendario de disponibilidad</h3>
      <button class="btn-secondary">Ver 14 días</button>
    </div>
    <div class="grid gap-3 md:grid-cols-7">
      <div v-for="day in snapshots" :key="day.date" :class="occupancyTone(day.occupancyRate)">
        <p class="text-xs text-white/50">{{ day.date }}</p>
        <p class="text-lg font-semibold text-hotel-cream">{{ day.occupancyRate }}%</p>
        <p class="text-xs text-white/60">Disp: {{ day.roomsAvailable }}</p>
        <p class="text-xs text-white/60">Ocup: {{ day.roomsOccupied }}</p>
      </div>
    </div>
  </div>
</template>
