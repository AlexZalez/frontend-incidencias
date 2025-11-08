<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { VForm } from 'vuetify/components'

  const { userLoginAction } = useAuthStore()

  // Si usas unplugin-vue-router, puedes marcar el layout del grupo Auth:
  definePage({
    meta: { layout: 'AuthLayout' },
  })

  const router = useRouter()

  const formRef = ref<VForm | null>(null)
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  const rules = {
    required: (v: string) => (!!v && v.toString().trim().length > 0) || 'Este campo es requerido',
    email: (v: string) =>
      (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254) || 'Email inválido',
    min6: (v: string) => (v?.length >= 6) || 'Mínimo 6 caracteres',
  }

  async function onSubmit () {
    try {
      errorMessage.value = null
      const { valid } = await formRef.value!.validate()
      if (!valid) throw new Error('INVALID FORM')

      loading.value = true
      const res = await userLoginAction({
        email: email.value,
        password: password.value,
      })

      await router.replace('/home/dashboard')
    } catch (e: any) {
      errorMessage.value = e?.message ?? 'Error inesperado'
    } finally {
      loading.value = false
    }
  }
  console.log(import.meta.env.BASE_URL)
</script>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card max-width="420" elevation="6" class="pa-6">
      <v-card-title class="text-h6 text-center">Bienvenido, inicia sesión</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="onSubmit" validate-on="blur">
          <v-alert
            v-if="errorMessage"
            type="error"
            density="comfortable"
            class="mb-4"
            :text="errorMessage"
            variant="tonal"
          />

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email"
            :rules="[rules.required, rules.email]"
            density="comfortable"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[rules.required, rules.min6]"
            density="comfortable"
            variant="outlined"
            class="mb-1"
          />

          <div class="d-flex justify-end mb-4">
            <v-btn variant="text" size="small">¿Olvidaste tu contraseña?</v-btn>
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Ingresar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>