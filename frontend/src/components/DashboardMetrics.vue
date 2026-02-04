<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  total: number;
  available: number;
  occupied: number;
  dirty: number;
  revenue: number;
  adr: number;
}>();

const occupancyRate = computed(() => {
  return props.total ? Math.round((props.occupied / props.total) * 100) : 0;
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    <!-- Occupancy Main Gauge -->
    <div class="glass-card p-6 relative overflow-hidden group">
      <div class="relative z-10">
        <span class="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-1 block">Ocupación Actual</span>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-extrabold text-hotel-cream tracking-tighter">{{ occupancyRate }}%</span>
          <span class="text-xs text-available font-medium">+2.1% vs ayer</span>
        </div>
        <div class="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-available to-hotel-cyan transition-all duration-1000"
            :style="{ width: `${occupancyRate}%` }"
          ></div>
        </div>
      </div>
      <!-- Background SVG Decoration -->
      <svg class="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none" />
      </svg>
    </div>

    <!-- Revenue -->
    <div class="glass-card p-6 relative overflow-hidden group">
      <div class="relative z-10">
        <span class="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-1 block">Revenue (Mes)</span>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-extrabold text-hotel-cream tracking-tighter">${{ revenue.toLocaleString() }}</span>
        </div>
        <div class="mt-4 flex gap-1 items-end h-8">
            <div v-for="n in 12" :key="n" 
                 class="flex-1 bg-white/10 rounded-t-sm hover:bg-hotel-cyan/40 transition-colors"
                 :style="{ height: `${Math.random() * 100}%` }">
            </div>
        </div>
      </div>
    </div>

    <!-- ADR -->
    <div class="glass-card p-6 relative overflow-hidden group">
      <div class="relative z-10">
        <span class="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-1 block">ADR</span>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-extrabold text-hotel-cream tracking-tighter">${{ adr }}</span>
          <span class="text-xs text-white/30 font-medium">Promedio/Noche</span>
        </div>
        <div class="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/20">
            <span>Low: $45</span>
            <span>Target: $120</span>
        </div>
      </div>
    </div>

    <!-- Room Status Summary -->
    <div class="glass-card p-6 relative overflow-hidden group">
      <div class="relative z-10">
        <span class="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-1 block">Estado Inventario</span>
        <div class="space-y-2 mt-2">
            <div class="flex justify-between items-center">
                <span class="text-xs text-white/60">Disponibles</span>
                <span class="text-sm font-bold text-available">{{ available }}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-xs text-white/60">Limpieza req.</span>
                <span class="text-sm font-bold text-dirty">{{ dirty }}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-xs text-white/60">Mantenimiento</span>
                <span class="text-sm font-bold text-maintenance">{{ props.total - props.available - props.occupied - props.dirty }}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.glass-card:hover {
  transform: translateY(-4px);
}
</style>
