<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
const showSnackbar = ref(false);

const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

const triggerSnackbar = () => {
  showSnackbar.value = true;
  setTimeout(() => {
    showSnackbar.value = false;
  }, 3500);
};
</script>

<template>
  <div class="space-y-6">
    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Botones</h3>
      <p class="text-sm text-white/60 mb-4">Acciones principales, secundarias e icono.</p>
      <div class="flex flex-wrap gap-3">
        <button class="btn-primary">Guardar cambios</button>
        <button class="btn-secondary">Cancelar</button>
        <button class="btn-ghost">Acción neutra</button>
        <button class="btn-icon" aria-label="Abrir opciones">⋮</button>
      </div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Entradas</h3>
      <p class="text-sm text-white/60 mb-4">Campos de texto, áreas y búsqueda.</p>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="field-label">Nombre de huésped</label>
          <input class="input-dark" placeholder="Camila Torres" />
        </div>
        <div>
          <label class="field-label">Email</label>
          <input class="input-dark" type="email" placeholder="camila@hotel.com" />
        </div>
        <div>
          <label class="field-label">Búsqueda</label>
          <div class="search-field">
            <span>🔎</span>
            <input class="search-input" placeholder="Buscar reservas..." />
          </div>
        </div>
        <div>
          <label class="field-label">Notas</label>
          <textarea class="input-dark" rows="3" placeholder="Preferencias del huésped..."></textarea>
        </div>
      </div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Formularios</h3>
      <p class="text-sm text-white/60 mb-4">Checkboxes y radios.</p>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-3">
          <label class="option-row">
            <input type="checkbox" />
            <span>Enviar confirmación por email</span>
          </label>
          <label class="option-row">
            <input type="checkbox" />
            <span>Agregar desayuno</span>
          </label>
        </div>
        <div class="space-y-3">
          <label class="option-row">
            <input type="radio" name="plan" />
            <span>Tarifa flexible</span>
          </label>
          <label class="option-row">
            <input type="radio" name="plan" />
            <span>Tarifa no reembolsable</span>
          </label>
        </div>
      </div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Tarjetas</h3>
      <p class="text-sm text-white/60 mb-4">Contenedores para datos clave.</p>
      <div class="grid gap-4 md:grid-cols-3">
        <div class="card-shell">
          <p class="text-xs text-white/60">Ocupación</p>
          <p class="text-2xl font-bold">78%</p>
          <p class="text-xs text-white/50">42 ocupadas</p>
        </div>
        <div class="card-shell">
          <p class="text-xs text-white/60">Revenue diario</p>
          <p class="text-2xl font-bold">$12,480</p>
          <p class="text-xs text-white/50">+8% vs ayer</p>
        </div>
        <div class="card-shell">
          <p class="text-xs text-white/60">Llegadas</p>
          <p class="text-2xl font-bold">14</p>
          <p class="text-xs text-white/50">3 VIP</p>
        </div>
      </div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Dropdown</h3>
      <p class="text-sm text-white/60 mb-4">Menú desplegable simple.</p>
      <details class="dropdown">
        <summary class="dropdown-trigger">Opciones rápidas</summary>
        <div class="dropdown-menu">
          <button>Ver reserva</button>
          <button>Enviar recordatorio</button>
          <button>Cancelar</button>
        </div>
      </details>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Modales</h3>
      <p class="text-sm text-white/60 mb-4">Acciones críticas o información.</p>
      <button class="btn-primary" @click="openModal">Abrir modal</button>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Alertas</h3>
      <p class="text-sm text-white/60 mb-4">Mensajes de feedback.</p>
      <div class="space-y-3">
        <div class="alert alert-success">Reserva confirmada exitosamente.</div>
        <div class="alert alert-warning">Quedan pocas habitaciones disponibles.</div>
        <div class="alert alert-error">No se pudo procesar el pago.</div>
      </div>
      <button class="btn-secondary mt-4" @click="triggerSnackbar">Mostrar snackbar</button>
      <div v-if="showSnackbar" class="snackbar">Cambios guardados.</div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">DataTable</h3>
      <p class="text-sm text-white/60 mb-4">Listado con columnas.</p>
      <div class="table-shell">
        <table class="w-full text-sm">
          <thead class="text-white/60">
            <tr>
              <th class="py-2">Reserva</th>
              <th class="py-2">Huésped</th>
              <th class="py-2">Estado</th>
              <th class="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row">
              <td class="py-3">#R-1021</td>
              <td class="py-3">Camila Torres</td>
              <td class="py-3"><span class="status-pill status-pill-confirmed">Confirmada</span></td>
              <td class="py-3 text-right">$780</td>
            </tr>
            <tr class="table-row">
              <td class="py-3">#R-1022</td>
              <td class="py-3">Lucas Diaz</td>
              <td class="py-3"><span class="status-pill status-pill-inhouse">In-house</span></td>
              <td class="py-3 text-right">$420</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="glass-card p-6">
      <h3 class="text-lg font-semibold text-hotel-cream">Carga de archivos</h3>
      <p class="text-sm text-white/60 mb-4">Adjuntar documentos o comprobantes.</p>
      <label class="upload-box">
        <input type="file" class="sr-only" />
        <div>
          <p class="text-sm">Arrastrar archivos o hacer click para subir</p>
          <p class="text-xs text-white/50">PDF, JPG o PNG</p>
        </div>
      </label>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="glass-card p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-hotel-cream mb-2">Confirmar acción</h3>
        <p class="text-sm text-white/60 mb-6">¿Querés confirmar el cambio?</p>
        <div class="flex gap-3">
          <button class="btn-primary w-full" @click="closeModal">Confirmar</button>
          <button class="btn-secondary w-full" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>
