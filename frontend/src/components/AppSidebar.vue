<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  active: 'operaciones' | 'comercial' | 'ui';
  onSelect: (value: 'operaciones' | 'comercial' | 'ui') => void;
}>();

const items = computed(() => [
  { id: 'operaciones', label: 'Operaciones', icon: '🏨' },
  { id: 'comercial', label: 'Comercial', icon: '💼' },
  { id: 'ui', label: 'UI Kit', icon: '🧩' },
]);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand-mark">PH</div>
      <div>
        <p class="text-sm text-white/60">PMS</p>
        <p class="text-lg font-semibold text-hotel-cream">Palo Alto</p>
      </div>
    </div>
    <nav class="sidebar-nav">
      <button
        v-for="item in items"
        :key="item.id"
        class="sidebar-link"
        :class="{ active: active === item.id }"
        @click="onSelect(item.id)"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>
    <div class="sidebar-footer">
      <p class="text-xs text-white/50">Staff console v1</p>
    </div>
  </aside>
</template>
