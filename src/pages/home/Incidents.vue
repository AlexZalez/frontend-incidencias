<script setup lang="ts">
  import { onMounted } from "vue"
  import { useIncidentsStore } from "@/stores/incidents"
import DialogCloseBtn from "@/components/general/DialogCloseBtn.vue"
  const { incidentsListAction, incidentDeleteAction, incidentUpdateAction } = useIncidentsStore()
  const { incidents } = storeToRefs(useIncidentsStore())

  const loading = reactive({ incidents: false })
  const dialog = reactive({ delete: false })
  const aIncident = ref(null)

  const headers = [
    { title: "Creado en", value: "created_at" },
    { title: "Origen", value: "origin" },
    { title: "¿Transferido?", value: "transferred" },
    { title: "Datos Medicos", value: "medical_data" },
    { title: "Observaciones", value: "observations" },
    { title: "Acciones", value: "actions" },
  ]

  function editIncident (item: any) {
    dialog.edit = true
    aIncident.value = item
  }

  function deleteIncident (item: any) {
    dialog.delete = true
    aIncident.value = item
  }

  async function confirmDelete (item: any) {
    try {
      // Lógica para eliminar la incidencia usando aIncident.value
      dialog.delete = false
      await incidentDeleteAction(aIncident.value.id);
      aIncident.value = null
    } catch (error) {
      console.log(error)
    }
    
  }

  async function fetchIncidents () {
    try {
        loading.incidents = true
      await incidentsListAction()
    } catch (error) {
      console.log(error)
    } finally {
      loading.incidents = false
    }
  }

  onMounted(() => {
    fetchIncidents()
  })  
</script>
<template>
  <div>
    <sectionTitle>Incidentes</sectionTitle>
    <VCard variant="flat" class="bg-grey-darken-3 pa-4 mt-4">
      <VDataTable
        :items="incidents"
        :headers="headers"
        :loading="loading.incidents"
        loading-text="Cargando incidencias..."
      >
        <template #item.origin="{ item }">
          <div>
            <span class="text-grey">Departamento:</span>
            {{ item.department }}
          </div>
          <div>
            <span class="text-grey">Cargo:</span>
            {{ item.position }}
          </div>
        </template>
        <template #item.medical_data="{ item }">
          <div>
            <span class="text-grey">Sistema Afectado:</span>
            {{ item.affected_system }}
          </div>
          <div>
            <span class="text-grey">Area del Cuerpo:</span>
            {{ item.body_area }}
          </div>
          <div>
            <span class="text-grey">Diagnostico:</span>
            {{ item.diagnostic }}
          </div>
        </template>

        <template #item.transferred="{value, item}">
          <template v-if="value">
            <span class="text-grey">Destino:</span> {{ item.destination }}
          </template>
          <template v-else>
            <VChip label>
              No transferido
            </VChip>

          </template>
        </template>

        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleString() }}
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2">
            <VBtn size="x-small" variant="tonal" icon="mdi-pencil" @click="editIncident(item)"></VBtn>
            <VBtn size="x-small" variant="tonal" icon="mdi-delete" color="red" @click="deleteIncident(item)"></VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="dialog.delete" max-width="500">
      <DialogCloseBtn @click="dialog.delete = false"></DialogCloseBtn>
      <VCard>
        <VCardTitle class="text-h5">Confirmar Eliminación</VCardTitle>
        <VCardText>¿Estás seguro de que deseas eliminar esta incidencia?</VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn text @click="dialog.delete = false">Cancelar</VBtn>
          <VBtn text color="red" @click="confirmDelete">Eliminar</VBtn>
        </VCardActions>
      </VCard>


    </VDialog>

    <VDialog v-model="dialog.edit" max-width="500">
      <DialogCloseBtn @click="dialog.edit = false"></DialogCloseBtn>
      <FormIncident :model="aIncident" @close="dialog.edit = false" schema="edit" :edit="incidentUpdateAction"></FormIncident>  
    </VDialog>
  </div>
</template>

<style scoped>

</style>