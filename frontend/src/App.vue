<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useHotelStore } from './stores/hotel';
import { useAuthStore } from './stores/auth';
import RoomCard from './components/RoomCard.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppNavbar from './components/AppNavbar.vue';
import UiShowcase from './components/UiShowcase.vue';
import ReservationTable from './components/ReservationTable.vue';
import RatePlansPanel from './components/RatePlansPanel.vue';
import FolioSummary from './components/FolioSummary.vue';
import OccupancyReport from './components/OccupancyReport.vue';
import AvailabilityCalendar from './components/AvailabilityCalendar.vue';
import { filterRooms, type RoomStatus, type RoomType } from './lib/roomFilters';
import { useCommercialStore } from './stores/commercial';
import ReservationFormModal from './components/ReservationFormModal.vue';
import RatePlanFormModal from './components/RatePlanFormModal.vue';
import FolioChargeModal from './components/FolioChargeModal.vue';

const hotelStore = useHotelStore();
const authStore = useAuthStore();
const commercialStore = useCommercialStore();

const email = ref('');
const password = ref('');
const activeRoomId = ref('');
const guestName = ref('');
const showCheckIn = ref(false);
const showCreateRoom = ref(false);
const activeCommercialTab = ref<'reservas' | 'tarifas' | 'folios' | 'ocupacion' | 'calendario'>('reservas');
const activeView = ref<'operaciones' | 'comercial' | 'ui'>('operaciones');
const showReservationModal = ref(false);
const showRatePlanModal = ref(false);
const showFolioChargeModal = ref(false);
const theme = ref<'dark' | 'light'>('dark');

const searchText = ref('');
const debouncedSearchText = ref('');
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const statusFilter = ref<'ALL' | RoomStatus>('ALL');
const typeFilter = ref<'ALL' | RoomType>('ALL');

const newRoom = ref<{
  number: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
}>({
  number: '',
  type: 'Simple',
  price: 50,
  status: 'AVAILABLE',
});

const isAuthed = computed(() => !!authStore.token);
const hasFilters = computed(() => {
  return (
    searchText.value.trim().length > 0 ||
    statusFilter.value !== 'ALL' ||
    typeFilter.value !== 'ALL'
  );
});

onMounted(async () => {
  document.documentElement.dataset.theme = theme.value;
  await authStore.me();
  if (isAuthed.value) {
    hotelStore.fetchRooms();
    commercialStore.refreshAll();
  }
});

watch(searchText, (value) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    debouncedSearchText.value = value;
  }, 200);
});

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
  if (isAuthed.value) {
    hotelStore.fetchRooms();
    commercialStore.refreshAll();
  }
};

const refreshRooms = () => {
  hotelStore.fetchRooms();
};

const resetFilters = () => {
  searchText.value = '';
  debouncedSearchText.value = '';
  statusFilter.value = 'ALL';
  typeFilter.value = 'ALL';
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme.value;
};

const openReservationModal = () => {
  showReservationModal.value = true;
};
const openRatePlanModal = () => {
  showRatePlanModal.value = true;
};
const openFolioChargeModal = () => {
  showFolioChargeModal.value = true;
};

const reservations = computed(() => commercialStore.reservations);
const ratePlans = computed(() => commercialStore.ratePlans);
const folio = computed(() => commercialStore.folio);
const occupancyToday = computed(() => commercialStore.occupancyToday);
const availabilityWeek = computed(() => commercialStore.availabilityWeek);

const commercialSummary = computed(() => {
  const totalReservations = reservations.value.length;
  const totalRevenue = reservations.value.reduce((sum, r) => sum + r.total, 0);
  const averageRate = totalReservations ? Math.round(totalRevenue / totalReservations) : 0;
  return { totalReservations, totalRevenue, averageRate };
});

const openCheckIn = (roomId: string) => {
  activeRoomId.value = roomId;
  guestName.value = '';
  showCheckIn.value = true;
};

const closeCheckIn = () => {
  showCheckIn.value = false;
  activeRoomId.value = '';
};

const submitCheckIn = async () => {
  if (!activeRoomId.value || !guestName.value.trim()) return;
  await hotelStore.checkIn(activeRoomId.value, guestName.value.trim());
  closeCheckIn();
};
const handleCheckOut = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar check-out',
    message: '¿Querés registrar el check-out ahora?',
    action: async () => {
      await hotelStore.checkOut(roomId);
    },
  };
};
const handleClean = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar limpieza',
    message: '¿Marcar la habitación como limpia?',
    action: async () => {
      await hotelStore.markClean(roomId);
    },
  };
};
const handleMaintenance = async (roomId: string) => {
  confirmAction.value = {
    title: 'Confirmar mantenimiento',
    message: '¿Enviar la habitación a mantenimiento?',
    action: async () => {
      await hotelStore.sendMaintenance(roomId);
    },
  };
};

const closeConfirm = () => {
  confirmAction.value = null;
};

const submitConfirm = async () => {
  if (!confirmAction.value) return;
  await confirmAction.value.action();
  closeConfirm();
};

const confirmAction = ref<null | { title: string; message: string; action: () => Promise<void> }>(null);

const filteredRooms = computed(() =>
  filterRooms(hotelStore.rooms, {
    text: debouncedSearchText.value,
    status: statusFilter.value,
    type: typeFilter.value,
  }),
);

const openCreateRoom = () => {
  newRoom.value = { number: '', type: 'Simple', price: 50, status: 'AVAILABLE' };
  showCreateRoom.value = true;
};
const closeCreateRoom = () => {
  showCreateRoom.value = false;
};
const submitCreateRoom = async () => {
  if (!newRoom.value.number.trim()) return;
  await hotelStore.createRoom({
    number: newRoom.value.number.trim(),
    type: newRoom.value.type,
    price: Number(newRoom.value.price),
    status: newRoom.value.status,
  });
  closeCreateRoom();
};
</script>

<template>
  <div class="min-h-screen bg-hotel-ink text-slate-100 app-shell">
    <div class="page-noise"></div>
    <AppSidebar v-if="isAuthed" :active="activeView" :onSelect="(value) => (activeView = value)" />

    <main class="app-content">
      <AppNavbar
        v-if="isAuthed"
        :userName="authStore.user?.name"
        :role="authStore.user?.role"
        :theme="theme"
        :onToggleTheme="toggleTheme"
        :onLogout="authStore.logout"
      />
      <section v-if="!isAuthed" class="max-w-md mx-auto glass-card p-8">
        <h2 class="text-2xl font-bold text-hotel-cream">Acceso del staff</h2>
        <p class="text-sm text-white/60 mb-6">Usá tus credenciales para ingresar.</p>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label for="login-email" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
            <input id="login-email" v-model="email" type="email" class="input-dark" placeholder="staff@paloalto.com" />
          </div>
          <div>
            <label for="login-password" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
            <input id="login-password" v-model="password" type="password" class="input-dark" placeholder="••••••••" />
          </div>
          <button class="btn-primary w-full" :disabled="authStore.loading">
            {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <p v-if="authStore.error" class="text-sm text-red-300">{{ authStore.error }}</p>
        </form>
      </section>

      <section v-else>
        <div class="status-legend">
          <span class="flex items-center gap-2"><div class="w-3 h-3 bg-available rounded-full"></div> Libre</span>
          <span class="flex items-center gap-2"><div class="w-3 h-3 bg-occupied rounded-full"></div> Ocupada</span>
          <span class="flex items-center gap-2"><div class="w-3 h-3 bg-dirty rounded-full"></div> Sucia</span>
          <span class="flex items-center gap-2"><div class="w-3 h-3 bg-maintenance rounded-full"></div> Mantenimiento</span>
        </div>
        <div class="flex flex-col gap-6 mb-6">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-hotel-cream">Habitaciones</h2>
              <p class="text-sm text-white/60">
                Bienvenido, {{ authStore.user?.name }} ({{ authStore.user?.role }})
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button class="btn-secondary" @click="refreshRooms">Refrescar</button>
              <button v-if="authStore.user?.role === 'ADMIN'" class="btn-primary" @click="openCreateRoom">Nueva habitación</button>
              <button class="btn-secondary" @click="authStore.logout()">Cerrar sesión</button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="metric-card">
              <span class="metric-label">Total</span>
              <span class="metric-value">{{ hotelStore.totalRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Libres</span>
              <span class="metric-value text-available">{{ hotelStore.availableRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Ocupadas</span>
              <span class="metric-value text-occupied">{{ hotelStore.occupiedRooms }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Sucia/Mant.</span>
              <span class="metric-value text-dirty">{{ hotelStore.dirtyRooms + hotelStore.maintenanceRooms }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex-1">
              <input v-model="searchText" class="input-dark" placeholder="Buscar por número o tipo..." />
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="{ active: statusFilter === 'ALL' }" @click="statusFilter = 'ALL'">Todos</button>
              <button class="chip" :class="{ active: statusFilter === 'AVAILABLE' }" @click="statusFilter = 'AVAILABLE'">Libres</button>
              <button class="chip" :class="{ active: statusFilter === 'OCCUPIED' }" @click="statusFilter = 'OCCUPIED'">Ocupadas</button>
              <button class="chip" :class="{ active: statusFilter === 'DIRTY' }" @click="statusFilter = 'DIRTY'">Sucias</button>
              <button class="chip" :class="{ active: statusFilter === 'MAINTENANCE' }" @click="statusFilter = 'MAINTENANCE'">Mantenimiento</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="chip" :class="{ active: typeFilter === 'ALL' }" @click="typeFilter = 'ALL'">Todos tipos</button>
              <button class="chip" :class="{ active: typeFilter === 'Simple' }" @click="typeFilter = 'Simple'">Simple</button>
              <button class="chip" :class="{ active: typeFilter === 'Doble' }" @click="typeFilter = 'Doble'">Doble</button>
              <button class="chip" :class="{ active: typeFilter === 'Suite' }" @click="typeFilter = 'Suite'">Suite</button>
              <button class="chip" :class="{ active: typeFilter === 'Presidential' }" @click="typeFilter = 'Presidential'">Presidential</button>
            </div>
          </div>
        </div>

        <div v-if="hotelStore.actionSuccess" class="toast toast-success">
          {{ hotelStore.actionSuccess }}
        </div>
        <div v-if="hotelStore.actionError" class="toast toast-error">
          {{ hotelStore.actionError }}
        </div>
        <p v-if="hotelStore.error" class="mb-4 text-sm text-red-300">{{ hotelStore.error }}</p>

        <div v-if="activeView === 'operaciones'">
          <div v-if="hotelStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-for="n in 10" :key="n" class="skeleton-card">
              <div class="skeleton-line w-16"></div>
              <div class="skeleton-line w-24"></div>
              <div class="skeleton-line w-12 mt-6"></div>
              <div class="skeleton-line w-20 mt-2"></div>
            </div>
          </div>

          <div v-else-if="filteredRooms.length === 0" class="glass-card p-8 text-center">
            <h3 class="text-xl font-semibold text-hotel-cream">Sin resultados</h3>
            <p class="text-sm text-white/60 mt-2">
              No hay habitaciones que coincidan con los filtros actuales.
            </p>
            <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button class="btn-secondary" @click="resetFilters" :disabled="!hasFilters">
                Limpiar filtros
              </button>
              <button class="btn-primary" @click="refreshRooms">
                Refrescar
              </button>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <RoomCard 
              v-for="(room, index) in filteredRooms" 
              :key="room.id" 
              :room="room" 
              :style="{ animationDelay: `${index * 40}ms` }"
              @check-in="openCheckIn"
              @check-out="handleCheckOut"
              @clean="handleClean"
              @maintenance="handleMaintenance"
            />
          </div>
        </div>

        <div v-else-if="activeView === 'comercial'" class="mt-10 space-y-6">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-hotel-cream">MVP Comercial</h2>
              <p class="text-sm text-white/60">Reservas, tarifas, folios y ocupación.</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <div class="metric-pill">
                <span class="metric-label">Reservas</span>
                <span class="metric-value">{{ commercialSummary.totalReservations }}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">Revenue</span>
                <span class="metric-value">${{ commercialSummary.totalRevenue }}</span>
              </div>
              <div class="metric-pill">
                <span class="metric-label">ADR</span>
                <span class="metric-value">${{ commercialSummary.averageRate }}</span>
              </div>
            </div>
          </div>
          <div class="tab-group">
              <button class="tab-btn" :class="{ active: activeCommercialTab === 'reservas' }" @click="activeCommercialTab = 'reservas'">
                Reservas
              </button>
              <button class="tab-btn" :class="{ active: activeCommercialTab === 'tarifas' }" @click="activeCommercialTab = 'tarifas'">
                Tarifas
              </button>
              <button class="tab-btn" :class="{ active: activeCommercialTab === 'folios' }" @click="activeCommercialTab = 'folios'">
                Folios
              </button>
              <button class="tab-btn" :class="{ active: activeCommercialTab === 'ocupacion' }" @click="activeCommercialTab = 'ocupacion'">
                Ocupación
              </button>
              <button class="tab-btn" :class="{ active: activeCommercialTab === 'calendario' }" @click="activeCommercialTab = 'calendario'">
                Calendario
              </button>
          </div>

          <ReservationTable
            v-if="activeCommercialTab === 'reservas'"
            :reservations="reservations"
            :onCreate="openReservationModal"
          />
          <RatePlansPanel
            v-else-if="activeCommercialTab === 'tarifas'"
            :plans="ratePlans"
            :onCreate="openRatePlanModal"
          />
          <FolioSummary
            v-else-if="activeCommercialTab === 'folios'"
            :folio="folio"
            :onAddCharge="openFolioChargeModal"
          />
          <OccupancyReport v-else-if="activeCommercialTab === 'ocupacion'" :snapshot="occupancyToday" />
          <AvailabilityCalendar v-else :snapshots="availabilityWeek" />
          <p v-if="commercialStore.error" class="mt-4 text-sm text-amber-300">
            {{ commercialStore.error }}
          </p>
        </div>

        <div v-else class="mt-10">
          <UiShowcase />
        </div>

        <ReservationFormModal
          :open="showReservationModal"
          @close="showReservationModal = false"
          @submit="(payload) => { commercialStore.addReservation(payload); showReservationModal = false; }"
        />
        <RatePlanFormModal
          :open="showRatePlanModal"
          @close="showRatePlanModal = false"
          @submit="(payload) => { commercialStore.addRatePlan(payload); showRatePlanModal = false; }"
        />
        <FolioChargeModal
          :open="showFolioChargeModal"
          @close="showFolioChargeModal = false"
          @submit="(payload) => { commercialStore.addFolioCharge(payload); showFolioChargeModal = false; }"
        />
      </section>
    </main>

    <div v-if="showCheckIn" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">Nuevo check-in</h3>
        <p class="text-sm text-white/60 mb-6">Asigná el huésped para la habitación seleccionada.</p>
        <div class="space-y-4">
          <div>
            <label for="checkin-guest" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Nombre huésped</label>
            <input id="checkin-guest" v-model="guestName" type="text" class="input-dark" placeholder="Juan Perez" />
          </div>
          <div class="flex gap-3">
            <button class="btn-primary w-full" @click="submitCheckIn">Confirmar</button>
            <button class="btn-secondary w-full" @click="closeCheckIn">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="confirmAction" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">{{ confirmAction.title }}</h3>
        <p class="text-sm text-white/60 mb-6">{{ confirmAction.message }}</p>
        <div class="flex gap-3">
          <button class="btn-primary w-full" @click="submitConfirm">Confirmar</button>
          <button class="btn-secondary w-full" @click="closeConfirm">Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showCreateRoom" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">Nueva habitación</h3>
        <p class="text-sm text-white/60 mb-6">Solo ADMIN puede crear habitaciones.</p>
        <div class="space-y-4">
          <div>
            <label for="room-number" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Número</label>
            <input id="room-number" v-model="newRoom.number" type="text" class="input-dark" placeholder="301" />
          </div>
          <div>
            <label for="room-type" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Tipo</label>
            <select id="room-type" v-model="newRoom.type" class="input-dark">
              <option>Simple</option>
              <option>Doble</option>
              <option>Suite</option>
              <option>Presidential</option>
            </select>
          </div>
          <div>
            <label for="room-price" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Precio</label>
            <input id="room-price" v-model.number="newRoom.price" type="number" class="input-dark" />
          </div>
          <div>
            <label for="room-status" class="block text-xs uppercase tracking-widest text-white/50 mb-2">Estado</label>
            <select id="room-status" v-model="newRoom.status" class="input-dark">
              <option>AVAILABLE</option>
              <option>OCCUPIED</option>
              <option>DIRTY</option>
              <option>MAINTENANCE</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button class="btn-primary w-full" @click="submitCreateRoom">Crear</button>
            <button class="btn-secondary w-full" @click="closeCreateRoom">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
