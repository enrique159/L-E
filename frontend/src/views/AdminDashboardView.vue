<template>
  <div class="admin-page">
    <aside class="admin-sidebar">
      <RouterLink class="admin-brand" to="/" aria-label="Ir a la invitación">
        <span>L <i>&amp;</i> E</span>
        <small>Nuestra boda</small>
      </RouterLink>

      <nav aria-label="Secciones administrativas">
        <button :class="{ active: activeTab === 'guests' }" @click="activeTab = 'guests'">
          <UsersRound :size="19" aria-hidden="true" />
          Invitados
          <span>{{ guests.length }}</span>
        </button>
        <button :class="{ active: activeTab === 'rsvps' }" @click="activeTab = 'rsvps'">
          <MessagesSquare :size="19" aria-hidden="true" />
          RSVPs
          <span>{{ rsvps.length }}</span>
        </button>
      </nav>

      <div class="admin-sidebar-footer">
        <div class="admin-user-chip">
          <span>{{ userInitials }}</span>
          <div>
            <strong>{{ currentUser?.fullname || 'Administrador' }}</strong>
            <small>{{ currentUser?.username }}</small>
          </div>
        </div>
        <button class="admin-logout" type="button" @click="logout">
          <LogOut :size="17" aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <div>
          <p class="admin-kicker">09 · Enero · 2027</p>
          <h1>{{ activeTab === 'guests' ? 'Lista de invitados' : 'Confirmaciones RSVP' }}</h1>
        </div>
        <RouterLink class="admin-view-invitation" to="/">
          Ver invitación <ExternalLink :size="16" aria-hidden="true" />
        </RouterLink>
      </header>

      <section class="admin-stats" aria-label="Resumen de la boda">
        <article>
          <span class="is-eucalyptus"><UsersRound :size="20" aria-hidden="true" /></span>
          <div><strong>{{ guests.length }}</strong><small>Invitados registrados</small></div>
        </article>
        <article>
          <span class="is-mist"><CircleCheckBig :size="20" aria-hidden="true" /></span>
          <div><strong>{{ attendingCount }}</strong><small>Personas confirmadas</small></div>
        </article>
        <article>
          <span class="is-plaster"><MessageCircleHeart :size="20" aria-hidden="true" /></span>
          <div><strong>{{ rsvps.length }}</strong><small>Respuestas recibidas</small></div>
        </article>
      </section>

      <section class="admin-panel" :aria-busy="loading">
        <div class="admin-toolbar">
          <div class="admin-search">
            <Search :size="18" aria-hidden="true" />
            <input
              v-model.trim="searchQuery"
              type="search"
              :placeholder="activeTab === 'guests' ? 'Buscar nombre, teléfono o grupo…' : 'Buscar nombre o teléfono…'"
              aria-label="Buscar registros"
            />
          </div>

          <select
            v-if="activeTab === 'rsvps'"
            v-model="attendanceFilter"
            class="admin-filter"
            aria-label="Filtrar por asistencia"
          >
            <option value="all">Todas las respuestas</option>
            <option value="yes">Sí asistirán</option>
            <option value="no">No asistirán</option>
          </select>

          <button
            v-if="activeTab === 'guests'"
            class="admin-primary-button admin-add-button"
            type="button"
            @click="openGuestModal()"
          >
            <Plus :size="18" aria-hidden="true" /> Agregar invitado
          </button>
          <button class="admin-icon-button" type="button" aria-label="Actualizar datos" @click="loadData">
            <RefreshCw :size="18" aria-hidden="true" />
          </button>
        </div>

        <p v-if="errorMessage" class="admin-banner-error" role="alert">
          <CircleAlert :size="18" aria-hidden="true" /> {{ errorMessage }}
        </p>

        <div v-if="loading" class="admin-loading" role="status">
          <LoaderCircle :size="24" aria-hidden="true" /> Cargando información…
        </div>

        <div v-else-if="activeTab === 'guests'" class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Invitado</th>
                <th>Contacto</th>
                <th>Grupo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="guest in filteredGuests" :key="guest.id">
                <td>
                  <strong>{{ guest.name }} {{ guest.surname }}</strong>
                  <small>{{ guest.relationship || 'Sin relación especificada' }}</small>
                </td>
                <td>
                  <span>{{ formatPhone(guest.phone) || 'Sin teléfono' }}</span>
                  <small>{{ guest.email || 'Sin correo' }}</small>
                </td>
                <td>{{ guest.group || '—' }}</td>
                <td><span class="admin-priority">{{ guest.priority }}</span></td>
                <td>
                  <span class="admin-badge" :class="guest.already_invited ? 'is-success' : 'is-neutral'">
                    {{ guest.already_invited ? 'Invitado' : 'Pendiente' }}
                  </span>
                </td>
                <td>
                  <div class="admin-row-actions">
                    <button type="button" aria-label="Editar invitado" @click="openGuestModal(guest)">
                      <Pencil :size="16" aria-hidden="true" />
                    </button>
                    <button class="is-danger" type="button" aria-label="Eliminar invitado" @click="removeGuest(guest)">
                      <Trash2 :size="16" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <AdminEmptyState v-if="!filteredGuests.length" message="No encontramos invitados con esos criterios." />
        </div>

        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Asistencia</th>
                <th>Personas</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="response in filteredRsvps" :key="response.id">
                <td><strong>{{ response.name }}</strong></td>
                <td>{{ formatPhone(response.phone) }}</td>
                <td>
                  <span class="admin-badge" :class="response.attendance === 'yes' ? 'is-success' : 'is-declined'">
                    {{ response.attendance === 'yes' ? 'Sí asistirá' : 'No asistirá' }}
                  </span>
                </td>
                <td>{{ response.guest_count }}</td>
                <td><span class="admin-note-preview">{{ response.note || '—' }}</span></td>
                <td>{{ formatDate(response.created_at) }}</td>
                <td>
                  <div class="admin-row-actions">
                    <button type="button" aria-label="Editar confirmación" @click="openRsvpModal(response)">
                      <Pencil :size="16" aria-hidden="true" />
                    </button>
                    <button class="is-danger" type="button" aria-label="Eliminar confirmación" @click="removeRsvp(response)">
                      <Trash2 :size="16" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <AdminEmptyState v-if="!filteredRsvps.length" message="No encontramos confirmaciones con esos criterios." />
        </div>
      </section>
    </main>

    <div v-if="modal.open" class="admin-modal-backdrop" role="presentation" @mousedown.self="closeModal">
      <section class="admin-modal" role="dialog" aria-modal="true" :aria-labelledby="modalTitleId">
        <header>
          <div>
            <p class="admin-kicker">{{ modal.type === 'guest' ? 'Invitados' : 'Confirmaciones' }}</p>
            <h2 :id="modalTitleId">{{ modalTitle }}</h2>
          </div>
          <button type="button" aria-label="Cerrar formulario" @click="closeModal">
            <X :size="20" aria-hidden="true" />
          </button>
        </header>

        <form v-if="modal.type === 'guest'" @submit.prevent="saveGuest">
          <div class="admin-form-grid">
            <label class="admin-field">
              <span>Nombre</span>
              <input v-model.trim="guestForm.name" required maxlength="120" />
            </label>
            <label class="admin-field">
              <span>Apellido</span>
              <input v-model.trim="guestForm.surname" required maxlength="120" />
            </label>
            <label class="admin-field">
              <span>Teléfono</span>
              <input v-model.trim="guestForm.phone" type="tel" maxlength="30" />
            </label>
            <label class="admin-field">
              <span>Correo</span>
              <input v-model.trim="guestForm.email" type="email" maxlength="160" />
            </label>
            <label class="admin-field">
              <span>Relación</span>
              <input v-model.trim="guestForm.relationship" placeholder="Familia, amistad…" maxlength="120" />
            </label>
            <label class="admin-field">
              <span>Grupo o mesa</span>
              <input v-model.trim="guestForm.group" maxlength="120" />
            </label>
            <label class="admin-field">
              <span>Prioridad</span>
              <input v-model.number="guestForm.priority" type="number" min="0" required />
            </label>
            <label class="admin-checkbox">
              <input v-model="guestForm.already_invited" type="checkbox" />
              <span>La invitación ya fue entregada</span>
            </label>
            <label class="admin-field admin-field-wide">
              <span>Notas</span>
              <textarea v-model.trim="guestForm.notes" rows="3"></textarea>
            </label>
          </div>

          <p v-if="modal.error" class="admin-form-error" role="alert">{{ modal.error }}</p>
          <div class="admin-modal-actions">
            <button class="admin-secondary-button" type="button" @click="closeModal">Cancelar</button>
            <button class="admin-primary-button" type="submit" :disabled="modal.saving">
              {{ modal.saving ? 'Guardando…' : 'Guardar invitado' }}
            </button>
          </div>
        </form>

        <form v-else @submit.prevent="saveRsvp">
          <div class="admin-form-grid">
            <label class="admin-field admin-field-wide">
              <span>Nombre completo</span>
              <input v-model.trim="rsvpForm.name" required maxlength="160" />
            </label>
            <label class="admin-field">
              <span>Teléfono</span>
              <input
                :value="rsvpForm.phone"
                type="tel"
                inputmode="numeric"
                maxlength="14"
                required
                @input="handleRsvpPhone"
              />
            </label>
            <label class="admin-field">
              <span>Asistencia</span>
              <select v-model="rsvpForm.attendance" @change="syncRsvpGuestCount">
                <option value="yes">Sí asistirá</option>
                <option value="no">No asistirá</option>
              </select>
            </label>
            <label v-if="rsvpForm.attendance === 'yes'" class="admin-field">
              <span>Número de personas</span>
              <select v-model.number="rsvpForm.guest_count">
                <option :value="1">1 persona</option>
                <option :value="2">2 personas</option>
                <option :value="3">3 personas</option>
                <option :value="4">4 personas</option>
              </select>
            </label>
            <label class="admin-field admin-field-wide">
              <span>Mensaje o restricciones</span>
              <textarea v-model.trim="rsvpForm.note" rows="4" maxlength="1000"></textarea>
            </label>
          </div>

          <p v-if="modal.error" class="admin-form-error" role="alert">{{ modal.error }}</p>
          <div class="admin-modal-actions">
            <button class="admin-secondary-button" type="button" @click="closeModal">Cancelar</button>
            <button class="admin-primary-button" type="submit" :disabled="modal.saving">
              {{ modal.saving ? 'Guardando…' : 'Guardar confirmación' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CircleAlert,
  CircleCheckBig,
  ExternalLink,
  LoaderCircle,
  LogOut,
  MessageCircleHeart,
  MessagesSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
  X,
} from '@lucide/vue'
import { apiRequest, clearSession, getSession } from '../config/api'

const AdminEmptyState = defineComponent({
  props: { message: { type: String, required: true } },
  setup(props) {
    return () => h('div', { class: 'admin-empty' }, [h(Search, { size: 24 }), h('p', props.message)])
  },
})

const router = useRouter()
const currentUser = ref(getSession()?.user || null)
const activeTab = ref('guests')
const guests = ref([])
const rsvps = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const attendanceFilter = ref('all')

const modal = reactive({ open: false, type: 'guest', mode: 'create', id: null, saving: false, error: '' })
const guestForm = reactive(emptyGuest())
const rsvpForm = reactive(emptyRsvp())

const userInitials = computed(() =>
  (currentUser.value?.fullname || 'Administrador')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase(),
)

const attendingCount = computed(() =>
  rsvps.value
    .filter((response) => response.attendance === 'yes')
    .reduce((total, response) => total + Number(response.guest_count || 0), 0),
)

const filteredGuests = computed(() => {
  const query = normalizeSearch(searchQuery.value)
  if (!query) return guests.value

  return guests.value.filter((guest) =>
    normalizeSearch(
      [guest.name, guest.surname, guest.phone, guest.email, guest.group, guest.relationship].join(' '),
    ).includes(query),
  )
})

const filteredRsvps = computed(() => {
  const query = normalizeSearch(searchQuery.value)
  return rsvps.value.filter((response) => {
    const matchesSearch = !query || normalizeSearch(`${response.name} ${response.phone}`).includes(query)
    const matchesAttendance =
      attendanceFilter.value === 'all' || response.attendance === attendanceFilter.value
    return matchesSearch && matchesAttendance
  })
})

const modalTitle = computed(() => {
  if (modal.type === 'guest') return modal.mode === 'create' ? 'Nuevo invitado' : 'Editar invitado'
  return 'Editar confirmación'
})
const modalTitleId = 'admin-modal-title'

onMounted(async () => {
  try {
    const session = await apiRequest('/api/auth/me')
    currentUser.value = { ...currentUser.value, ...session.user }
    await loadData()
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      clearSession()
      await router.replace('/admin/login')
      return
    }
    errorMessage.value = 'No fue posible cargar el panel.'
    loading.value = false
  }
})

async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [guestData, rsvpData] = await Promise.all([
      apiRequest('/api/guests'),
      apiRequest('/api/rsvps'),
    ])
    guests.value = guestData
    rsvps.value = rsvpData
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      await logout()
      return
    }
    errorMessage.value = 'No pudimos actualizar la información. Revisa la conexión con el backend.'
  } finally {
    loading.value = false
  }
}

function openGuestModal(guest = null) {
  Object.assign(guestForm, emptyGuest(), guest || {})
  modal.open = true
  modal.type = 'guest'
  modal.mode = guest ? 'edit' : 'create'
  modal.id = guest?.id || null
  modal.error = ''
}

function openRsvpModal(response) {
  Object.assign(rsvpForm, emptyRsvp(), response, { phone: formatPhone(response.phone) })
  modal.open = true
  modal.type = 'rsvp'
  modal.mode = 'edit'
  modal.id = response.id
  modal.error = ''
}

function closeModal() {
  if (modal.saving) return
  modal.open = false
  modal.error = ''
}

async function saveGuest() {
  modal.saving = true
  modal.error = ''
  const payload = {
    name: guestForm.name,
    surname: guestForm.surname,
    phone: guestForm.phone || null,
    email: guestForm.email || null,
    relationship: guestForm.relationship || null,
    priority: Number(guestForm.priority || 0),
    group: guestForm.group || null,
    notes: guestForm.notes || null,
    already_invited: Boolean(guestForm.already_invited),
  }

  try {
    await apiRequest(modal.mode === 'edit' ? `/api/guests/${modal.id}` : '/api/guests', {
      method: modal.mode === 'edit' ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    })
    closeAfterSave()
    await loadData()
  } catch (error) {
    modal.error = error?.message || 'No fue posible guardar el invitado.'
  } finally {
    modal.saving = false
  }
}

async function saveRsvp() {
  modal.saving = true
  modal.error = ''
  const phone = normalizePhone(rsvpForm.phone)

  if (phone.length !== 10) {
    modal.error = 'El teléfono debe contener 10 dígitos.'
    modal.saving = false
    return
  }

  try {
    await apiRequest(`/api/rsvps/${modal.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: rsvpForm.name,
        phone,
        attendance: rsvpForm.attendance,
        guest_count: rsvpForm.attendance === 'yes' ? Number(rsvpForm.guest_count) : 0,
        note: rsvpForm.note || null,
      }),
    })
    closeAfterSave()
    await loadData()
  } catch (error) {
    modal.error =
      error?.code === 'RSVP_PHONE_EXISTS'
        ? 'Ese teléfono pertenece a otra confirmación.'
        : error?.message || 'No fue posible guardar la confirmación.'
  } finally {
    modal.saving = false
  }
}

async function removeGuest(guest) {
  if (!window.confirm(`¿Eliminar a ${guest.name} ${guest.surname}? Esta acción no se puede deshacer.`)) return
  try {
    await apiRequest(`/api/guests/${guest.id}`, { method: 'DELETE' })
    guests.value = guests.value.filter((item) => item.id !== guest.id)
  } catch (error) {
    errorMessage.value = error?.message || 'No fue posible eliminar el invitado.'
  }
}

async function removeRsvp(response) {
  if (!window.confirm(`¿Eliminar la confirmación de ${response.name}? Esta acción no se puede deshacer.`)) return
  try {
    await apiRequest(`/api/rsvps/${response.id}`, { method: 'DELETE' })
    rsvps.value = rsvps.value.filter((item) => item.id !== response.id)
  } catch (error) {
    errorMessage.value = error?.message || 'No fue posible eliminar la confirmación.'
  }
}

function closeAfterSave() {
  modal.open = false
  modal.error = ''
}

function handleRsvpPhone(event) {
  rsvpForm.phone = formatPhone(event.target.value)
}

function syncRsvpGuestCount() {
  rsvpForm.guest_count = rsvpForm.attendance === 'yes' ? Math.max(1, rsvpForm.guest_count || 1) : 0
}

function emptyGuest() {
  return {
    name: '', surname: '', phone: '', email: '', relationship: '', priority: 0,
    group: '', notes: '', already_invited: false,
  }
}

function emptyRsvp() {
  return { name: '', phone: '', attendance: 'yes', guest_count: 1, note: '' }
}

function normalizePhone(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 10)
}

function formatPhone(value) {
  const digits = normalizePhone(value)
  if (!digits) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function normalizeSearch(value) {
  return String(value || '').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function logout() {
  clearSession()
  await router.replace('/admin/login')
}
</script>
