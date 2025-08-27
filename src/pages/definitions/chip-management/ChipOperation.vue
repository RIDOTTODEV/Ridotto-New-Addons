<script setup>
import { useChipManagement } from 'src/composables/definitions/useChipManagement'
const { currentChipOperationTab, chipOperationTabs, onChangeChipOperationTab } = useChipManagement()
import ChipStockTabContent from 'src/components/pages/definitions/chip-management/ChipStockTabContent.vue'
import ChipTransferTabContent from 'src/components/pages/definitions/chip-management/ChipTransferTabContent.vue'
</script>

<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="currentChipOperationTab"
      @update:model-value="onChangeChipOperationTab"
      dense
      class="text-dark"
      active-color="white"
      indicator-color="blue-grey-8"
      active-bg-color="blue-grey-8"
      align="left"
      narrow-indicator
      no-caps
      inline-label
    >
      <q-tab
        v-for="(tab, index) in chipOperationTabs"
        :key="index"
        :v-el-perms="tab.elPermission"
        no-caps
        :name="tab.name"
        :label="$t(tab.label)"
        :icon="tab.icon"
        :class="index === 0 ? 'q-card--bordered bg-white' : 'q-card--bordered q-ml-sm bg-white'"
      />
    </q-tabs>
    <q-tab-panels v-model="currentChipOperationTab" animated class="q-mt-sm full-height">
      <q-tab-panel
        v-el-perms="'Addon.ChipOperations.Tab.ShowChipStock'"
        name="chipStock"
        class="q-card no-box-shadow q-pa-none bg-transparent"
      >
        <chip-stock-tab-content />
      </q-tab-panel>
      <q-tab-panel
        v-el-perms="'Addon.ChipOperations.Tab.ShowChipTransfer'"
        name="chipTransfer"
        class="q-card no-box-shadow q-pa-none bg-transparent"
      >
        <chip-transfer-tab-content />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style scoped lang="scss"></style>
