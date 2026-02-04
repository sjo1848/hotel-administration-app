<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Reservation } from '../lib/commercialTypes';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: Omit<Reservation, 'id'>): void;
}>();

const form = reactive({
  guestName: '',
  roomType: 'Simple',
  roomNumber: '',
  checkInDate: '',
  checkOutDate: '',
  status: 'CONFIRMED' as Reservation['status'],
  total: 0,
});

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.guestName = '';
      form.roomType = 'Simple';
      form.roomNumber = '';
      form.checkInDate = '';
      form.checkOutDate = '';
      form.status = 'CONFIRMED';
      form.total = 0;
    }
  },
);

const submit = () => {
  if (!form.guestName || !form.checkInDate || !form.checkOutDate) return;
  emit('submit', {
    guestName: form.guestName,
    roomType: form.roomType,
    roomNumber: form.roomNumber || null,
    checkInDate: form.checkInDate,
    checkOutDate: form.checkOutDate,
    status: form.status,
    total: Number(form.total || 0),
  });
};
</script>

<template>
  <div v-if="open" class="modal-overlay">
    <div class="glass-card p-6 w-full max-w-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-hotel-cream">Nueva reserva</h3>
        <button class="btn-icon" @click="emit('close')">✕</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="field-label">Huésped</label>
          <input class="input-dark" v-model="form.guestName" placeholder="Nombre y apellido" />
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
          <label class="field-label">Número (opcional)</label>
          <input class="input-dark" v-model="form.roomNumber" placeholder="301" />
        </div>
        <div>
          <label class="field-label">Check-in</label>
          <input class="input-dark" type="date" v-model="form.checkInDate" />
        </div>
        <div>
          <label class="field-label">Check-out</label>
          <input class="input-dark" type="date" v-model="form.checkOutDate" />
        </div>
        <div>
          <label class="field-label">Estado</label>
          <select class="input-dark" v-model="form.status">
            <option value="CONFIRMED">Confirmada</option>
            <option value="CHECKED_IN">In-house</option>
            <option value="CHECKED_OUT">Salida</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="NO_SHOW">No-show</option>
          </select>
        </div>
        <div>
          <label class="field-label">Total</label>
          <input class="input-dark" type="number" v-model.number="form.total" />
        </div>
      </div>
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary w-full" @click="emit('close')">Cancelar</button>
        <button class="btn-primary w-full" @click="submit">Guardar</button>
      </div>
    </div>
  </div>
</template>
