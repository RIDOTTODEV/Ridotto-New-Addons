<template>
  <q-layout view="lHh Lpr lff">
    <q-page-container class="">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInspectorOrderStore } from 'src/stores/inspector-order-store'
const inspectorOrderStore = useInspectorOrderStore()

onMounted(() => {
  inspectorOrderStore.fetchPosSettings()
})
</script>
