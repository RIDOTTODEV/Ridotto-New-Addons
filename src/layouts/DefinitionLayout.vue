<template>
  <q-layout view="lHh Lpr lff">
    <AppHeader :drawer="drawer" @update:drawer="drawer = $event" />
    <q-page-container class="app-content-bg">
      <router-view />
    </q-page-container>
    <Sidebar :drawer="drawer" />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(true)
</script>
