<template>
  <q-layout view="lHh Lpr lff">
    <AppHeader :drawer="drawer" @update:drawer="drawer = $event" />
    <q-page-container class="app-content-bg">
      <AnimatedRouterView />
    </q-page-container>
    <Sidebar :drawer="drawer" />
    <SetCashDesk />
  </q-layout>
</template>

<script setup>
import AnimatedRouterView from 'src/components/layout/AnimatedRouterView.vue'
import { useLayout } from 'src/composables/layout/useLayout'
const { drawer, SetCashDesk } = useLayout()
</script>
