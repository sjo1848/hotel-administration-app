<script setup lang="ts">
import type { Folio } from '../lib/commercialTypes';

defineProps<{
  folio: Folio;
  onAddCharge: () => void;
}>();
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-hotel-cream">Folio</h3>
        <p class="text-sm text-white/60">{{ folio.guestName }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary" @click="onAddCharge">Agregar cargo</button>
        <button class="btn-primary">Enviar factura</button>
      </div>
    </div>
    <div class="folio-total">
      <span>Total</span>
      <strong>${{ folio.total }}</strong>
    </div>
    <div class="space-y-3">
      <div v-for="line in folio.lines" :key="line.id" class="folio-line">
        <span>{{ line.description }}</span>
        <span>${{ line.amount }}</span>
      </div>
    </div>
  </div>
</template>
