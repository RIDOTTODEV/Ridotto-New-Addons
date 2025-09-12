<template>
  <q-card square flat class="bg-transparent">
    <q-card-section class="q-pl-sm q-pr-sm q-pt-sm q-pb-none">
      <div class="row full-height flex justify-between">
        <div class="content-center full-height col-12">
          <div class="full-width flex justify-between col-12 items-center">
            <q-tabs
              v-model="currentTableOperationTab"
              @update:model-value="onChangeTab"
              dense
              class="text-dark"
              active-color="white"
              indicator-color="blue-grey-8"
              active-bg-color="blue-grey-8"
              align="justify"
              narrow-indicator
              no-caps
              inline-label
            >
              <q-tab
                v-for="(tab, index) in tableOperationTabs"
                :key="index"
                :data-cy="tab.name"
                v-el-perms="tab.elPermission"
                no-caps
                :name="tab.name"
                :label="$t(tab.label)"
                :icon="tab.icon"
                :class="
                  index === 0 ? 'q-card--bordered bg-white' : 'q-card--bordered q-ml-sm bg-white'
                "
              />
            </q-tabs>
            <q-btn
              v-el-perms="'Addon.TableOperations.Tab.TableCountStableSettings'"
              icon="o_settings"
              color="blue-grey-8"
              text-color="white"
              unelevated
              no-caps
              @click="onClickTableOperationSettings"
              class="q-card--bordered"
            >
              <q-tooltip class="text-subtitle2 bg-blue-grey-8">{{
                $t('tableCountStableSettings')
              }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-card square flat class="bg-transparent">
    <q-card-section class="q-pa-sm">
      <q-tab-panels v-model="currentTableOperationTab" animated class="full-height bg-transparent">
        <q-tab-panel
          v-el-perms="'Addon.TableOperations.Tab.ShowTableList'"
          name="tables"
          class="no-box-shadow q-pa-none"
        >
          <Tables />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.TableOperations.Tab.TableCountReport'"
          name="tableCount"
          class="no-box-shadow q-pa-none"
        >
          <TableCount />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.TableOperations.Tab.TableCountReport'"
          name="tableCountReport"
          class="no-box-shadow q-pa-none"
        >
          <TableCountReport />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.TableOperations.Tab.CountCheckReport'"
          name="countCheckReport"
          class="no-box-shadow q-pa-none"
        >
          <TableChipBalance />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import Tables from './tab-contents/Tables.vue'
import TableCount from './tab-contents/TableCount.vue'
import TableCountReport from './tab-contents/TableCountReport.vue'
import TableChipBalance from './tab-contents/TableChipBalance.vue'
import { LocalStorage, useQuasar } from 'quasar'
const $q = useQuasar()
const tableOperationTabs = ref([
  {
    label: 'tables',
    elPermission: 'Addon.TableOperations.Tab.ShowTableList',
    icon: 'o_grid_view',
    name: 'tables',
  },
  {
    label: 'tableCount',
    elPermission: 'Addon.TableOperations.Tab.TableCount',
    icon: 'o_calculate',
    name: 'tableCount',
  },
  {
    label: 'tableCountReport',
    elPermission: 'Addon.TableOperations.Tab.TableCountReport',
    icon: 'o_article',
    name: 'tableCountReport',
  },
  {
    label: 'tableChipBalance',
    elPermission: 'Addon.TableOperations.Tab.CountCheckReport',
    icon: 'o_article',
    name: 'countCheckReport',
  },
])

const currentTableOperationTab = ref(LocalStorage.getItem('tableOperationTab') || 'tables')

const onChangeTab = (tab) => {
  LocalStorage.set('tableOperationTab', tab)
}

const onClickTableOperationSettings = () => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/table-operations/dialogs/TableOperationSettings.vue'),
    ),
  })
}
</script>

<style scoped></style>
