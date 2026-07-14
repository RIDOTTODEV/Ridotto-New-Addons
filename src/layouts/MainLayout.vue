<template>
  <q-layout view="lHh Lpr lff">
    <AppHeader :drawer="drawer" @update:drawer="onToggleDrawer" />
    <q-page-container>
      <AnimatedRouterView />
    </q-page-container>
    <AppSidebar :drawer="drawer" @update:drawer="drawer = $event" />
    <SetCashDesk />
  </q-layout>
</template>

<script setup>
import AnimatedRouterView from 'src/components/layout/AnimatedRouterView.vue'
import { useLayout } from 'src/composables/layout/useLayout'

const { drawer, SetCashDesk, onToggleDrawer } = useLayout()
</script>
