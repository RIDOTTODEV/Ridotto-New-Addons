<template>
  <div class="flex">
    <div class="flex">
      <div class="flex flex-row gap-2 justify-between items-center">
        <q-tabs
          v-model="currentCashlessTab"
          @update:model-value="(val) => onChangeTab(val)"
          dense
          content-class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
          class="w-full sm:w-auto"
          active-color="white"
          indicator-color="blue-grey-8"
          active-bg-color="blue-grey-8"
          align="left"
          narrow-indicator
          no-caps
          inline-label
        >
          <q-tab
            v-for="(tab, index) in cashlessOperationTabs"
            :key="index"
            :data-cy="tab.key"
            :v-el-perms="tab.elPermission"
            no-caps
            :name="tab.name"
            :label="$t(tab.label)"
            :icon="tab.icon"
            class="app-cart-grey q-card--bordered"
          />
        </q-tabs>
        <q-btn
          v-el-perms="'Addon.CashlessOperations.Transaction.CreateCashlessAccount'"
          class="q-ml-sm q-mr-sm q-card--bordered"
          no-caps
          size="13px"
          :label="$t('addCashlessAccount')"
          icon="add"
          unelevated
          color="grey-3"
          text-color="black"
          @click="createNewCashlessAccount"
          v-show="currentCashlessTab === 'cashless'"
        />
      </div>
    </div>
    <q-tab-panels v-model="currentCashlessTab" animated class="q-mt-sm full-height bg-transparent">
      <q-tab-panel
        v-el-perms="'Addon.CashlessOperation.Tab.ShowCashlessDetail'"
        name="cashless"
        class="bg-transparent no-box-shadow q-pa-none"
      >
        <div class="row">
          <div class="col-12">
            <CashlessTabContent />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel
        v-el-perms="'Addon.CashlessOperation.Tab.ShowChip'"
        name="chip"
        class="bg-transparent no-box-shadow q-pa-none"
      >
        <ChipTabContent />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LocalStorage } from 'quasar'
import CashlessTabContent from 'src/components/pages/player-operations/transaction-tab/CashlessTabContent.vue'
import ChipTabContent from 'src/components/pages/player-operations/transaction-tab/ChipTabContent.vue'

import { usePlayer } from 'src/composables/player-operations/usePlayer'

const { createNewCashlessAccount } = usePlayer()
const currentCashlessTab = ref('cashless')
onMounted(() => {
  currentCashlessTab.value = LocalStorage.getItem('cashlessTab') || 'cashless'
})

const onChangeTab = (val) => {
  LocalStorage.set('cashlessTab', val)
}

const cashlessOperationTabs = ref([
  {
    label: 'cashless',
    elPermission: 'Addon.CashlessOperation.Tab.ShowCashlessDetail',
    icon: 'o_account_tree',
    name: 'cashless',
  },
  {
    label: 'chip',
    elPermission: 'Addon.CashlessOperation.Tab.ShowChip',
    icon: 'o_account_tree',
    name: 'chip',
  },
])
</script>

<style scoped></style>
