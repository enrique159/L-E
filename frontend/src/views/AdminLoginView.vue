<template>
  <main class="admin-login-page">
    <div class="admin-login-art" aria-hidden="true">
      <span class="admin-login-monogram">L <i>&amp;</i> E</span>
      <p>09 · 01 · 2027</p>
    </div>

    <section class="admin-login-card" aria-labelledby="login-title">
      <RouterLink class="admin-back-link" to="/">
        <ArrowLeft :size="16" aria-hidden="true" /> Volver a la invitación
      </RouterLink>
      <p class="admin-kicker">Área privada</p>
      <h1 id="login-title">Panel de nuestra boda</h1>
      <p class="admin-login-copy">Ingresa para consultar invitados y confirmaciones.</p>

      <form :aria-busy="submitting" @submit.prevent="login">
        <label class="admin-field">
          <span>Usuario</span>
          <div class="admin-input-wrap">
            <UserRound :size="18" aria-hidden="true" />
            <input v-model.trim="credentials.username" autocomplete="username" required />
          </div>
        </label>

        <label class="admin-field">
          <span>Contraseña</span>
          <div class="admin-input-wrap">
            <LockKeyhole :size="18" aria-hidden="true" />
            <input
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
            />
            <button
              class="admin-password-toggle"
              type="button"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="17" aria-hidden="true" />
              <Eye v-else :size="17" aria-hidden="true" />
            </button>
          </div>
        </label>

        <button class="admin-primary-button" type="submit" :disabled="submitting">
          {{ submitting ? 'Ingresando…' : 'Ingresar al panel' }}
          <ArrowRight v-if="!submitting" :size="18" aria-hidden="true" />
        </button>
        <p v-if="errorMessage" class="admin-form-error" role="alert">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from '@lucide/vue'
import { apiRequest, setSession } from '../config/api'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const credentials = reactive({ username: '', password: '' })

async function login() {
  errorMessage.value = ''
  submitting.value = true

  try {
    const session = await apiRequest(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false,
    )
    setSession(session)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    await router.replace(redirect.startsWith('/admin') ? redirect : '/admin')
  } catch (error) {
    errorMessage.value =
      error?.status === 401
        ? 'El usuario o la contraseña no son correctos.'
        : 'No pudimos conectar con el backend. Inténtalo nuevamente.'
  } finally {
    submitting.value = false
  }
}
</script>
