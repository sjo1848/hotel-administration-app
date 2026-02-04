<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { RatePlan } from '../lib/commercialTypes';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: Omit<RatePlan, 'id'>): void;
}>();

const form = reactive({
  name: '',
  roomType: 'Simple',
  price: 0,
  currency: 'USD',
  refundable: true,
});

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.name = '';
      form.roomType = 'Simple';
      form.price = 0;
      form.currency = 'USD';
      form.refundable = true;
    }
  },
);

const submit = () => {
  if (!form.name || !form.price) return;
  emit('submit', {
    name: form.name,
    roomType: form.roomType,
    price: Number(form.price),
    currency: form.currency,
    refundable: form.refundable,
  });
};
</script>

<template>
  <div v-if="open" class="modal-overlay">
    <div class="glass-card p-6 w-full max-w-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-hotel-cream">Nuevo rate plan</h3>
        <button class="btn-icon" @click="emit('close')">✕</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="field-label">Nombre</label>
          <input class="input-dark" v-model="form.name" placeholder="Best Flexible" />
        </div>
        <div>
          <label class="field-label">Tipo</label>
          <select class="input-dark" v-model="form.roomType">
            <option>Simple</option>
            <option>Doble</option>
            <option>Suite</option>
            <option>Presidential</option>
          </select>
        </div>
        <div>
          <label class="field-label">Precio</label>
          <input class="input-dark" type="number" v-model.number="form.price" />
        </div>
        <div>
          <label class="field-label">Moneda</label>
          <select class="input-dark" v-model="form.currency">
            <option>USD</option>
            <option>ARS</option>
            <option>EUR</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.refundable" />
          <span class="text-sm">Reembolsable</span>
        </div>
      </div>
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary w-full" @click="emit('close')">Cancelar</button>
        <button class="btn-primary w-full" @click="submit">Guardar</button>
      </div>
    </div>
  </div>
</template>
