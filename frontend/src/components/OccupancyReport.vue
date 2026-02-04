<script setup lang="ts">
import type { OccupancySnapshot } from '../lib/commercialTypes';

defineProps<{
  snapshot: OccupancySnapshot;
}>();
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-hotel-cream">Ocupación hoy</h3>
      <span class="text-sm text-white/50">{{ snapshot.date }}</span>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="metric-card">
        <span class="metric-label">Ocupación</span>
        <span class="metric-value">{{ snapshot.occupancyRate }}%</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Disponibles</span>
        <span class="metric-value text-available">{{ snapshot.roomsAvailable }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Ocupadas</span>
        <span class="metric-value text-occupied">{{ snapshot.roomsOccupied }}</span>
      </div>
    </div>
    <div class="progress-shell mt-5">
      <div class="progress-bar" :style="{ width: `${snapshot.occupancyRate}%` }"></div>
    </div>
  </div>
</template>
