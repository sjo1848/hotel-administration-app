<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  userName?: string;
  role?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
}>();

const initials = computed(() => {
  if (!props.userName) return 'ST';
  return props.userName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});
</script>

<template>
  <header class="topbar">
    <div>
      <h1 class="text-2xl font-semibold text-hotel-cream">Panel operativo</h1>
      <p class="text-sm text-white/60">Visión general en tiempo real</p>
    </div>
    <div class="topbar-actions">
      <div class="user-chip">
        <div class="avatar">{{ initials }}</div>
        <div>
          <p class="text-sm">{{ userName ?? 'Staff' }}</p>
          <p class="text-xs text-white/50">{{ role ?? 'STAFF' }}</p>
        </div>
      </div>
      <button class="btn-secondary" @click="onToggleTheme">
        {{ theme === 'dark' ? 'Modo claro' : 'Modo oscuro' }}
      </button>
      <button class="btn-secondary" @click="onLogout">Cerrar sesión</button>
    </div>
  </header>
</template>
