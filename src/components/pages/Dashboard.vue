<template>
  <ActiveFloorInfo />
  <!--   <div class="col-12 text-right">
    <q-btn
      v-el-perms="'Addon.Dashboard.Settings'"
      icon="fas fa-edit"
      color="app-content-bg"
      text-color="grey-10"
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
      >
        <component :is="components[item.component]" />
      </GridItem>
    </GridLayout>
  </div> -->
</template>

<script setup>
import ActiveFloorInfo from 'src/pages/reports/management-reports/ActiveFloorInfoReport.vue'
//import { GridLayout, GridItem } from 'vue-grid-layout-v3'
//import { ref, defineAsyncComponent } from 'vue'
/* const state = ref({
  layout: [
    { x: 0, y: 0, w: 6, h: 8, i: '0', component: 'ActiveFloorInfo' },
    { x: 6, y: 0, w: 6, h: 8, i: '1', component: 'GetTimeInOut' },
      { x: 4, y: 0, w: 6, h: 8, i: '2', component: 'GetTimeInOutByPlayer' },
    { x: 6, y: 0, w: 6, h: 8, i: '3', component: 'GetTimeInOutByTable' },
    { x: 8, y: 0, w: 6, h: 8, i: '4', component: 'GetTableFloats' },
  ],
  draggable: true,
  resizable: true,
  responsive: true,
}) */
/* const components = {
  ActiveFloorInfo: defineAsyncComponent(
    () => import('src/components/pages/reports/reports/GetPlayerResultReport.vue'),
  ),
  GetTimeInOut: defineAsyncComponent(
    () => import('src/components/pages/reports/reports/GetTimeInOutReport.vue'),
  ),
    GetTimeInOutByPlayer: defineAsyncComponent(
    () => import('src/components/pages/reports/reports/GetTimeInOutByPlayerReport.vue'),
  ),
  GetTimeInOutByTable: defineAsyncComponent(
    () => import('src/components/pages/reports/reports/GetTimeInOutByTableReport.vue'),
  ),
  GetTableFloats: defineAsyncComponent(
    () => import('src/components/pages/reports/reports/GetTableFloatsReport.vue'),
  ),
} */
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
