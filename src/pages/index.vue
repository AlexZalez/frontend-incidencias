<template>
  <div>Redirigiendo a login…</div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  onMounted(() => {
    // Reemplaza la entrada del historial para evitar que el usuario vuelva a esta ruta con el botón atrás
    router.replace('/login')
  })
</script>

