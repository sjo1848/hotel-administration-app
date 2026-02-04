<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { FolioLine } from '../lib/commercialTypes';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: Omit<FolioLine, 'id'>): void;
}>();

const form = reactive({
  description: '',
  amount: 0,
});

watch(
  () => props.open,
  (value) => {
    if (value) {
      form.description = '';
      form.amount = 0;
    }
  },
);

const submit = () => {
  if (!form.description || !form.amount) return;
  emit('submit', {
    description: form.description,
    amount: Number(form.amount),
  });
};
</script>

<template>
  <div v-if="open" class="modal-overlay">
    <div class="glass-card p-6 w-full max-w-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-hotel-cream">Agregar cargo</h3>
        <button class="btn-icon" @click="emit('close')">✕</button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="field-label">Descripción</label>
          <input class="input-dark" v-model="form.description" placeholder="Room service" />
        </div>
        <div>
          <label class="field-label">Monto</label>
          <input class="input-dark" type="number" v-model.number="form.amount" />
        </div>
      </div>
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary w-full" @click="emit('close')">Cancelar</button>
        <button class="btn-primary w-full" @click="submit">Agregar</button>
      </div>
    </div>
  </div>
</template>
