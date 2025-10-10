<template>
  <q-card square flat class="bg-transparent">
    <q-card-section class="q-pl-sm q-pr-sm q-pt-sm q-pb-none">
      <div class="row full-height flex justify-between">
        <div class="content-center full-height">
          <div class="full-width">
            <q-tabs
              v-model="currentCageTab"
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
                v-for="(tab, index) in cageOperationTabs"
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
          </div>
        </div>
        <div class="full-height">
          <balance />
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-card square flat class="bg-transparent">
    <q-card-section class="q-pa-sm">
      <q-tab-panels v-model="currentCageTab" animated class="full-height bg-transparent">
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.ShowAccountList'"
          name="accounts"
          class="no-box-shadow q-pa-none"
        >
          <AccountList />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.PettyCash'"
          name="pettyCash"
          class="q-pa-none no-box-shadow"
        >
          <petty-cash />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.CageTransactions'"
          name="cageTransactions"
          class="q-pa-none no-box-shadow"
        >
          <cage-transactions />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.ChipTransactions'"
          name="chipTransactions"
          class="q-pa-none no-box-shadow"
        >
          <chip-transactions />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.ChipBalanceUpdate'"
          name="chipBalance"
          class="q-card q-pa-none no-box-shadow"
        >
          <chip-balance />
        </q-tab-panel>
        <q-tab-panel
          v-el-perms="'Addon.CageOperations.Tab.BalanceUpdate'"
          name="count"
          class="q-card q-pa-none no-box-shadow"
        >
          <cash-balance />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import AccountList from 'src/components/pages/cage-operations/tab-contens/AccountList.vue'
import CageTransactions from 'src/components/pages/cage-operations/tab-contens/CageTransactions.vue'
import ChipTransactions from 'src/components/pages/cage-operations/tab-contens/ChipTransactions.vue'
import ChipBalance from 'src/components/pages/cage-operations/tab-contens/ChipBalance.vue'
import CashBalance from 'src/components/pages/cage-operations/tab-contens/CashBalance.vue'
import Balance from 'src/components/pages/cage-operations/tab-contens/Balance.vue'
import PettyCash from 'src/components/pages/cage-operations/tab-contens/PettyCash.vue'
import { LocalStorage } from 'quasar'
const cageOperationTabs = ref([
  {
    label: 'accountList',
    elPermission: 'Addon.CageOperations.Tab.ShowAccountList',
    icon: 'o_account_tree',
    name: 'accounts',
  },
  {
    label: 'pettyCash',
    elPermission: 'Addon.CageOperations.Tab.PettyCash',
    icon: 'o_money',
    name: 'pettyCash',
  },
  {
    label: 'cageTransactions',
    elPermission: 'Addon.CageOperations.Tab.CageTransactions',
    icon: 'o_import_export',
    name: 'cageTransactions',
  },
  {
    label: 'chipTransactions',
    elPermission: 'Addon.CageOperations.Tab.ChipTransactions',
    icon: 'o_change_circle',
    name: 'chipTransactions',
  },
  {
    label: 'balance',
    elPermission: 'Addon.CageOperations.Tab.BalanceUpdate',
    icon: 'o_schedule',
    name: 'count',
  },
  {
    label: 'chipBalance',
    elPermission: 'Addon.CageOperations.Tab.ChipBalanceUpdate',
    icon: 'o_casino',
    name: 'chipBalance',
  },
])

const currentCageTab = ref(LocalStorage.getItem('cageTab') || 'accounts')

const onChangeTab = (tab) => {
  LocalStorage.set('cageTab', tab)
}

// watch the router query params
watch(
  () => router.currentRoute.value.query,
  (newVal) => {
    if (newVal.tab) {
      currentCageTab.value = newVal.tab
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
