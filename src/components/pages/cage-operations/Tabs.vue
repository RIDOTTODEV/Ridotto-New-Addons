<template>
  <div class="cage-tabs">
    <div class="cage-tabs__bar">
      <q-tabs
        v-model="currentCageTab"
        @update:model-value="onChangeTab"
        dense
        no-caps
        inline-label
        align="left"
        indicator-color="primary"
        active-color="primary"
        class="cage-tabs__rail"
        content-class="cage-tabs__content"
        mobile-arrows
        outside-arrows
      >
        <q-tab
          v-for="(tab, index) in cageOperationTabs"
          :key="index"
          :data-cy="tab.name"
          v-el-perms="tab.elPermission"
          no-caps
          :ripple="false"
          :name="tab.name"
          :label="$t(tab.label)"
          :icon="tab.icon"
          class="cage-tabs__tab"
        />
      </q-tabs>

      <balance class="cage-tabs__balance" />
    </div>

    <q-tab-panels
      v-model="currentCageTab"
      animated
      class="cage-tabs__panels full-height bg-transparent"
    >
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
      <q-tab-panel
        v-el-perms="'Addon.CageOperations.Tab.Reports'"
        name="reports"
        class="q-card q-pa-none no-box-shadow"
      >
        <reports />
      </q-tab-panel>
    </q-tab-panels>
  </div>
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
import Reports from 'src/components/pages/cage-operations/tab-contens/Reports.vue'
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
  {
    label: 'reports',
    elPermission: 'Addon.CageOperations.Tab.Reports',
    icon: 'o_article',
    name: 'reports',
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

<style lang="scss" scoped >
/* ------------------------------------------------------------------
 * Premium tab rail — sits on #f4f8f9 page background.
 * Single rounded glass surface, hairline separators between items,
 * elevated white card with soft sidebar-blue glow for the active tab.
 * ------------------------------------------------------------------ */
.cage-tabs {
  --rail-bg: #ffffff;
  --rail-border: rgba(15, 23, 42, 0.10);
  // --rail-radius: 18px;
  // --tab-radius: 14px;
  --tab-text: #363636;
  --tab-text-hover: #1e293b;
  --tab-text-active: #0f172a;
  --tab-icon-muted: #94a3b8;
  --tab-accent: #3c5275;
  --tab-accent-soft: rgba(29, 54, 94, 0.1);
  --tab-separator: rgba(15, 23, 42, 0.08);
  --tab-hover-bg: rgba(15, 23, 42, 0.045);

  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  // font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
  //   'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.cage-tabs__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 4px 4px 0;
  margin-bottom: 16px;
}

.cage-tabs__balance {
  flex: 0 0 auto;
  margin-left: auto;
}

/* ---------- The solid card rail (q-tabs root) ---------- */
.cage-tabs__rail {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  background: var(--rail-bg);
  border: 1px solid var(--rail-border);
  border-radius: var(--rail-radius);
  padding: 6px;
  min-height: unset;

  /* Sharper, well-defined card shadow on #f4f8f9 surface */
  // box-shadow:
  //   0 1px 0 rgba(255, 255, 255, 1) inset,
  //   0 1px 1px rgba(15, 23, 42, 0.04),
  //   0 2px 4px rgba(15, 23, 42, 0.06),
  //   0 6px 16px -6px rgba(15, 23, 42, 0.12),
  //   0 12px 24px -12px rgba(15, 23, 42, 0.10);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  :deep(.q-tabs__content) {
    gap: 2px;
    align-items: stretch;
    min-height: unset;
  }

  :deep(.q-tabs__arrow) {
    color: #94a3b8;
    font-size: 18px;
    width: 28px;
    min-width: 28px;
    opacity: 0.9;

    &:hover {
      color: var(--tab-accent);
    }
  }
}

/* ---------- Individual tab pills ---------- */
.cage-tabs__tab {
  position: relative;
  border-radius: var(--tab-radius);
  color: var(--tab-text);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.005em;
  text-transform: none;
  min-height: unset;
  overflow: visible;
  flex: 0 0 auto;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;

  :deep(.q-tab__content) {
    min-height: 38px;
    // padding: 8px 16px;
    gap: 8px;
  }

  :deep(.q-tab__icon) {
    font-size: 25px;
    color: var(--tab-icon-muted);
    opacity: 1;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  :deep(.q-tab__label) {
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.005em;
  }

  :deep(.q-focus-helper) {
    display: none !important;
  }

  :deep(.q-tab__indicator) {
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: var(--tab-accent);
    opacity: 0;
    transform: scaleX(0.4);
    transform-origin: center;
    transition: opacity 0.2s ease, transform 0.25s ease;
  }

  /* Hairline vertical separator between tabs */
  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 24%;
    bottom: 24%;
    width: 1px;
    background: var(--tab-separator);
    border-radius: 1px;
    opacity: 1;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:first-of-type::before {
    opacity: 0;
  }

  &:hover:not(.q-tab--active) {
    color: var(--tab-text-hover);
    background-color: var(--tab-hover-bg);

    :deep(.q-tab__icon) {
      color: var(--tab-accent);
    }
  }

  /* ---------- Active state: subtle tinted background + visible indicator ---------- */
  &.q-tab--active {
    color: var(--tab-text-active);
    background: var(--tab-accent-soft);
    box-shadow:
      0 0 0 1px rgba(59, 130, 246, 0.12),
      0 1px 2px rgba(59, 130, 246, 0.06);

    :deep(.q-tab__icon) {
      color: var(--tab-accent);
    }

    :deep(.q-tab__label) {
      font-weight: 600;
    }

    :deep(.q-tab__indicator) {
      opacity: 1;
      transform: scaleX(1);
    }

    /* Hide own and immediate neighbour's separator */
    &::before {
      opacity: 0;
    }

    & + .cage-tabs__tab::before {
      opacity: 0;
    }
  }
}

/* ---------- Panels ---------- */
.cage-tabs__panels {
  background: transparent;

  :deep(.q-tab-panel) {
    padding: 0;
  }
}
</style>
