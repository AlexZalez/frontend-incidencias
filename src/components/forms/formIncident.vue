<script lang="ts" setup>
  import type { VForm } from 'vuetify/components'
  import { ref, reactive, computed, onMounted } from 'vue'
  import { supabase } from '@/lib/supabase'
  import rules from '@/utils/rules'
import { useAuthStore } from '@/stores/auth'

  
  type Schema = 'new' | 'edit'

  interface IncidentReport {
    id?: number
    department: string
    position: string
    transferred: boolean
    destination: string | null
    affected_system: string
    diagnostic: string
    body_area: string
    observations: string
  }

  const props = defineProps<{
    schema?: Schema
    edit?: (any) => Promise<void>
    model?: Partial<IncidentReport>
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submitted', payload: IncidentReport): void
  }>()

  const loading = reactive({ submit: false })

  const finish = ref(false)


  const defaults: IncidentReport = {
    department: '',
    position: '',
    transferred: false,
    destination: null,
    affected_system: '',
    diagnostic: '',
    body_area: '',
    observations: '',
  }

  const formData = reactive<IncidentReport>({ ...defaults, ...(props.model ?? {}) })

  interface TFormValid { validate: () => Promise<{ valid: boolean }>; reset: () => void }
  const formValid = ref<TFormValid>()

  const aTitle = computed(() =>
    (props.schema ?? 'new') === 'new'
      ? 'Crear reporte de incidencia'
      : 'Editar reporte de incidencia',
  )

  const btnText = computed(() =>
    (props.schema ?? 'new') === 'new'
      ? 'Crear'
      : 'Editar',
  )

  async function submit () {
    try {
      loading.submit = true
      const res = await formValid.value?.validate()
      if (!res?.valid) throw new Error('INVALID FORM')

      const payload: IncidentReport = {
        ...formData,
      }

      if (props.schema == 'edit') {
        await props.edit(payload, props.model?.id!)
      }else{
        const { data, error } = await supabase
          .from('report_emergency_services')
          .insert({
            department: payload.department,
            position: payload.position,
            transferred: payload.transferred,
            destination: payload.destination,
            affected_system: payload.affected_system,
            diagnostic: payload.diagnostic,
            body_area: payload.body_area,
            observations: payload.observations,
          })
          .select()
  
        finish.value = true
      }
      emit('close')
    } catch (error) {
      console.log(error)
    } finally {
      loading.submit = false
    }
  }

  const newIncident = () => {
    finish.value = false
    handleReset()
  }

  function handleReset () {
    Object.assign(formData, { ...defaults, ...(props.model ?? {}) })
    formValid.value?.reset()
  }

  onMounted(() => {
  
  })
</script>

<template>
  <VCard>
    <VCardText v-if="!finish">
      <VForm ref="formValid" validate-on="input" @submit.prevent="submit">
        <VRow>
          <VCol cols="12" md="6">
            <v-text-field
              v-model="formData.department"
              label="Departamento"
              maxlength="120"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12" md="6">
            <v-text-field
              v-model="formData.position"
              label="Cargo / Posición"
              maxlength="120"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSwitch
              v-model="formData.transferred"
              inset
              label="Transferido"
            />
          </VCol>

          <VCol cols="12" md="6">
            <v-text-field
              v-model="formData.destination"
              label="Destino de transferencia"
              maxlength="120"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12" md="6">
            <v-text-field
              v-model="formData.affected_system"
              label="Sistema afectado"
              maxlength="120"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12" md="6">
            <v-text-field
              v-model="formData.body_area"
              label="Área corporal"
              maxlength="120"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.diagnostic"
              auto-grow
              label="Diagnóstico"
              maxlength="1000"
              rows="3"
              :rules="[rules.required]"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.observations"
              auto-grow
              label="Observaciones"
              maxlength="1500"
              rows="3"
            />
          </VCol>

          <VCol class="d-flex gap-3" cols="12">
            <VSpacer />
            <VBtn
              color="secondary"
              :disabled="loading.submit"
              text="Limpiar"
              variant="tonal"
              class="mr-3"
              @click="handleReset"
            />
            <VBtn
              :loading="loading.submit"
              :text="btnText"
              color="primary"
              type="submit"
            />
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
    <div v-else>
      <div class="text-center my-12">
        <VIcon size="64" color="success">mdi-check-circle-outline</VIcon>
        <h2 class="mt-4">Reporte de incidencia registrado con éxito</h2>
        <p>El reporte ha sido creado correctamente.</p>
        <div class="mt-6">
          <VBtn class="mr-2" color="primary" :to="{name:'incidents'}">Ver Incidencias</VBtn>
          <VBtn color="primary" @click="newIncident">Nueva Incidencia</VBtn>
        </div>
      </div>
    </div>
  </VCard>
</template>
