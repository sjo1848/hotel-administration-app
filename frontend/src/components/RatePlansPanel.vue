<script setup lang="ts">
import type { RatePlan } from '../lib/commercialTypes';

defineProps<{
  plans: RatePlan[];
  onCreate: () => void;
}>();
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-hotel-cream">Rate plans</h3>
        <p class="text-sm text-white/60">Tarifas activas y reglas comerciales.</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary">Duplicar</button>
        <button class="btn-primary" @click="onCreate">Nuevo plan</button>
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="plan in plans" :key="plan.id" class="rate-card">
        <div>
          <p class="text-sm text-white/60">{{ plan.roomType }}</p>
          <h4 class="text-xl font-semibold text-hotel-cream">{{ plan.name }}</h4>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="tag">BAR</span>
            <span class="tag">{{ plan.refundable ? 'Flex' : 'NRF' }}</span>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-white/60">Precio</p>
          <p class="text-2xl font-bold">{{ plan.currency }} {{ plan.price }}</p>
          <p class="text-xs text-white/50">
            {{ plan.refundable ? 'Reembolsable' : 'No reembolsable' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
