<template>
  <div class="col-12 text-right">
    <q-btn
      v-el-perms="'Addon.Dashboard.Settings'"
      icon="fas fa-edit"
      color="app-content-bg"
      text-color="blue-grey-8"
      unelevated
      no-caps
      size="13px"
      class=""
    >
      <q-tooltip class="text-subtitle2 bg-blue-grey-8">{{ $t('dashboardSettings') }}</q-tooltip>
    </q-btn>
  </div>
  <div class="dashboard-container col-12">
    <GridLayout
      v-model:layout="state.layout"
      :row-height="50"
      :is-draggable="state.draggable"
      :is-resizable="state.resizable"
      :responsive="state.responsive"
      :vertical-compact="true"
      :use-css-transforms="true"
      class="app-content-bg"
    >
      <GridItem
        v-for="item in state.layout"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="onResized(item)"
        @moved="onMoved(item)"
      >
        <component :is="components[item.component]" v-on="getEventHandlers(item.component)" />
      </GridItem>
    </GridLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import { ref, defineAsyncComponent } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()
const { userDashboardLayout } = storeToRefs(authStore)
const state = ref(userDashboardLayout.value)

onMounted(async () => {
  await authStore.getUserDashboardLayout()
})
// Define event handlers for each component type
const getEventHandlers = (componentName) => {
  const handlers = {
    GetActiveGuests: {
      guestsLength: (length) => {
        state.value.layout.forEach((item) => {
          if (item.component === 'GetActiveGuests') {
            item.h = length * 2
          }
        })
      },
    },
    // Add handlers for other components as needed
    GetPendingGuests: {
      guestsLength: (length) => {
        state.value.layout.forEach((item) => {
          if (item.component === 'GetPendingGuests') {
            item.h = length
          }
        })
      },
    },
    GetGuestTransferList: {
      guestsLength: (length) => {
        state.value.layout.forEach((item) => {
          if (item.component === 'GetGuestTransferList') {
            item.h = length * 2
          }
        })
      },
    },
  }

  return handlers[componentName] || {}
}

const components = {
  GetActiveGuests: defineAsyncComponent(
    () => import('src/components/pages/dashboard/widgets/GetActiveGuests.vue'),
  ),
  GetPendingGuests: defineAsyncComponent(
    () => import('src/components/pages/dashboard/widgets/GetPendingGuests.vue'),
  ),
  GetGuestTransferList: defineAsyncComponent(
    () => import('src/components/pages/dashboard/widgets/GetGuestTransferList.vue'),
  ),
}

const onResized = (item) => {
  console.log('onResized', item)
  authStore.updateUserDashboardLayout(state.value)
}

const onMoved = (item) => {
  console.log('onMoved', item)
  authStore.updateUserDashboardLayout(state.value)
}
</script>

<style scoped>
.dashboard-card {
  height: auto !important;
  min-height: 100vh;
}

.dashboard-container {
  width: 100%;
  height: auto;
  min-height: 2000px;
}

.vue-grid-layout {
  min-height: 100%;
  height: auto !important;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  border: 1px solid rgb(195, 195, 195);
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 10px;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid rgb(182, 182, 182);
  margin-top: 10px;
  padding: 10px;
}

.columns {
  columns: 120px;
}
</style>
