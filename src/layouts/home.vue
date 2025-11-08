<script lang="ts" setup>
  import { useAuthStore } from "@/stores/auth"
  const { userLogOutAction } = useAuthStore()
  const items = [
    {
      title: 'Registrar Incidencia',
      to: { name: 'report-incident' },
    },
  ]

  const drawer = ref(false)
  const group = ref(null)

  const onLogout = () => {
    console.log('Cerrando sesión...')
    userLogOutAction()
  }
  watch(group, () => {
    drawer.value = false
  })
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  
        <v-toolbar-title>Incidencias</v-toolbar-title>
  
  
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item @click="onLogout">
              <v-list-item-title>Cerrar Sesion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
  
      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item :to="{ name: 'dashboard' }">
            Dashboard
          </v-list-item>
          <v-list-item :to="{ name: 'incidents' }">
            Ver Incidencias
          </v-list-item>
          <v-list-item :to="{ name: 'report-incident' }">
            Registrar Incidencia
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-main style="height: 100vh; overflow: auto;" >
        <div class="pa-4">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>
