<template>
  <q-header class="app-header-shell app-header">
    <div class="app-header-content flex items-stretch">
      <div class="app-header-main flex-1 grid grid-cols-[auto_1fr] md:py-2.5 py-3 gap-y-2 min-w-0">
        <div>
          <div class="flex justify-start items-center gap-x-2 px-2">
            <q-icon name="menu" size="md" color="grey-7" class="cursor-pointer" @click="toggleDrawer"
              transition-show="scale" transition-hide="scale" />
            <SearchPlayerInput v-if="!isMobile || !drawer" class="super-small search-input" :placeholder="$t('search')"
              v-model="selectedUser" @onSelectPlayer="onSelectPlayer" @onClear="onClearPlayer" optionLabel="value" />
          </div>
        </div>
        <div v-if="!isMobile || !drawer">
          <div class="flex justify-end items-center px-2 gap-2">
            <div v-if="!isMobile && isAuthorityUser" class="ops-status">
              <div class="ops-status__item ops-status__item--clickable" :class="cashDeskMatchClass"
                @click="bus.emit('setNewCashDesk')">
                <span class="ops-status__dot" :class="cashDeskDotClass" />
                <span class="ops-status__name">{{ selectedCashDesk?.name }}</span>
                <span class="ops-status__date">{{ selectedCashDesk?.gamingDate }}</span>

              </div>
              <span class="ops-status__divider" />
              <div class="ops-status__item">
                <q-icon name="o_dashboard" size="16px" class="ops-status__icon" />
                <span class="ops-status__label">{{ $t('Kasalar') }}</span>
                <span class="ops-status__metric" :class="cashdeskMetricClass">
                  <span class="ops-status__metric-current">{{
                    defaultGamingDateInfo?.cashdeskInGamingDateCount ?? '-'
                  }}</span>
                  <span class="ops-status__metric-sep">/</span>
                  <span class="ops-status__metric-total">{{
                    defaultGamingDateInfo?.cashdeskCount ?? '-'
                  }}</span>
                </span>
                <q-btn v-if="
                  defaultGamingDateInfo &&
                  defaultGamingDateInfo?.cashdeskInGamingDateCount !==
                  defaultGamingDateInfo?.cashdeskCount
                " v-el-perms="'Addon.CageOperations.GamingDateChangeUpdate'" flat dense round size="sm"
                  icon="calendar_month" class="ops-status__action" @click.stop="changeCashDeskGamingDate">

                </q-btn>

              </div>

              <span class="ops-status__divider" />

              <div class="ops-status__item">
                <q-icon name="border_clear" size="16px" class="ops-status__icon" />
                <span class="ops-status__label">{{ $t('Masalar') }}</span>
                <span class="ops-status__metric" :class="liveTableMetricClass">
                  <span class="ops-status__metric-current">{{
                    defaultGamingDateInfo?.liveTableCount ?? '-'
                  }}</span>
                  <span class="ops-status__metric-sep">/</span>
                  <span class="ops-status__metric-total">{{
                    defaultGamingDateInfo?.allLiveTableCount ?? '-'
                  }}</span>
                </span>
                <q-btn v-if="
                  defaultGamingDateInfo &&
                  defaultGamingDateInfo?.liveTableCount !==
                  defaultGamingDateInfo?.allLiveTableCount
                " v-el-perms="'Addon.CageOperations.GamingDateChangeUpdate'" flat dense round size="sm"
                  icon="o_change_circle" class="ops-status__action"
                  @click.stop="router.push({ name: 'tableOperations' })">

                </q-btn>

              </div>
            </div>
            <ExchangeCalculation />
          </div>
        </div>
      </div>
      <q-btn v-if="!isMobile || !drawer" flat unelevated no-caps padding="0" class="header-user-profile">
        <div class="header-user-profile__inner q-px-sm">
          <q-avatar size="24px" class="header-user-profile__avatar">
            <q-icon name="o_person" size="sm" />
          </q-avatar>
          <div v-if="!isMobile" class="header-user-profile__text">
            <div class="header-user-profile__name text-capitalize">
              {{ getUserNameSurname.fullName }}
            </div>
            <div v-if="userRole" class="header-user-profile__role">
              {{ userRole }}
            </div>
          </div>
        </div>
        <q-menu style="margin-top: 5px !important">
          <div class="row no-wrap q-pa-md">
            <div class="column w-full">
              <q-toggle v-model="userSettings.darkMode" label="Dark Mode" @click="onToggleDarkMode" />
              <q-toggle v-model="userSettings.fullScreen" label="Screen Mode" @click="$q.fullscreen.toggle()" />
              <q-select v-if="isAuthorityUser" v-model="userAddonSettings.DefaultCurrencyId" :options="currencies"
                map-options emit-value option-value="id" :option-label="(val) => val.symbol + ' ' + val.name"
                label="Default Currency" @update:model-value="(val) => authStore.saveUserCurrency(val, true)" dense />
              <q-select v-model="userSettings.selectedLocale" :options="locales" label="Default Locale"
                @update:model-value="localeChange" dense map-options emit-value option-value="lang"
                option-label="title">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>
                        <q-img :src="scope.opt.iconPath" fit="contain" width="20px" height="20px" class="q-mr-sm" />
                        {{ scope.opt.title }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <div class="text-subtitle2">
                    <q-img :src="scope.opt.iconPath" fit="contain" width="20px" height="20px" class="q-mr-sm" />
                    {{ scope.opt.title }}
                  </div>
                </template>
              </q-select>
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center gap-y-md w-full">
              <div class="text-h6 text-capitalize">
                {{ getUserNameSurname.fullName }}
              </div>

              <q-btn v-if="isAuthorityUser" color="grey-2" text-color="dark" label="Ridotto" unelevated
                icon="o_language" size="13px" no-caps class="q-mt-sm full-width" @click="redirectToRidotto" />
              <q-btn v-if="isAuthorityUser" color="grey-2" text-color="dark" label="Inspector" unelevated icon="login"
                size="13px" no-caps class="q-mt-sm full-width" @click="bus.emit('triggerDraw')" to="/inspector"
                target="_blank" />
              <q-btn no-caps color="red-10" :label="$t('logout')" size="13px" v-close-popup icon="logout"
                @click="mainOidc.signOut()" class="full-width q-mt-md" unelevated />
            </div>
          </div>
          <div class="w-full full-width bg-blue-grey-1 q-card--bordered">
            <div v-if="isMobile" class="row col-12 w-full">
              <div class="col-12 q-pa-xs">
                <div class="text-caption">
                  <span class="font-bold pr-2">{{ $t('Gaming Date') }}:</span>{{ selectedCashDesk.gamingDate }}
                </div>
              </div>
              <div class="col-6 q-pa-xs">
                <div @click="bus.emit('setNewCashDesk')" :class="{
                  'bg-green-8 text-white':
                    selectedCashDesk?.gamingDateId === defaultGamingDateInfo?.id,
                  'bg-negative text-white':
                    selectedCashDesk?.gamingDateId !== defaultGamingDateInfo?.id,
                  'p-1 rounded-sm': true,
                }" class="cursor-pointer flex content-center flex-col text-caption">
                  <div class="flex items-center gap-x-2">
                    <q-icon name="account_balance" size="18px" /> {{ selectedCashDesk.name }}
                  </div>
                </div>
              </div>
              <div class="col q-pa-xs">
                <div class="flex items-center text-caption" :class="{
                  'bg-green-8 text-white':
                    defaultGamingDateInfo?.cashdeskInGamingDateCount ===
                    defaultGamingDateInfo?.cashdeskCount,
                  'bg-negative text-white':
                    defaultGamingDateInfo?.cashdeskInGamingDateCount !==
                    defaultGamingDateInfo?.cashdeskCount,
                  'p-1 rounded-sm': true,
                }" @click="changeCashDeskGamingDate">
                  <q-icon :name="defaultGamingDateInfo?.cashdeskInGamingDateCount ===
                    defaultGamingDateInfo?.cashdeskCount
                    ? 'o_dashboard'
                    : 'calendar_month'
                    " size="18px" />
                  {{ defaultGamingDateInfo?.cashdeskInGamingDateCount }}/{{
                    defaultGamingDateInfo?.cashdeskCount
                  }}
                </div>
              </div>
              <div class="col q-pa-xs">
                <div class="flex items-center text-caption" :class="{
                  'bg-green-8 text-white':
                    defaultGamingDateInfo?.allLiveTableCount ===
                    defaultGamingDateInfo?.liveTableCount,
                  'bg-negative text-white':
                    defaultGamingDateInfo?.allLiveTableCount !==
                    defaultGamingDateInfo?.liveTableCount,
                  'p-1 rounded-sm': true,
                }" @click="router.push({ name: 'tableOperations' })">
                  <q-icon :name="defaultGamingDateInfo?.allLiveTableCount ===
                    defaultGamingDateInfo?.liveTableCount
                    ? 'border_clear'
                    : 'o_change_circle'
                    " size="18px" />
                  {{ defaultGamingDateInfo?.liveTableCount }}/{{
                    defaultGamingDateInfo?.allLiveTableCount
                  }}
                </div>
              </div>
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
    <!-- <AppBreadcrumb /> -->
    <VisitedPagesTabs />
  </q-header>
</template>
<script setup>
import { computed } from 'vue'
import { useHeader } from 'src/composables/layout/useHeader'
import ExchangeCalculation from 'src/components/atoms/ExchangeCalculation.vue'
// import AppBreadcrumb from 'src/components/layout/AppBreadcrumb.vue'
import VisitedPagesTabs from 'src/components/layout/VisitedPagesTabs.vue'
const emit = defineEmits(['update:drawer', 'setNewCashDesk', 'triggerDraw'])
const props = defineProps({
  drawer: {
    type: Boolean,
    default: () => true,
    required: false,
  },
})

const {
  toggleDrawer,
  mainOidc,
  isAuthorityUser,
  getUserNameSurname,
  onToggleDarkMode,
  $q,
  redirectToRidotto,
  userSettings,
  locales,
  onChangeLanguage,
  currencies,
  authStore,
  selectedCashDesk,
  defaultGamingDateInfo,
  router,
  bus,
  selectedUser,
  onSelectPlayer,
  onClearPlayer,
  changeCashDeskGamingDate,
  userAddonSettings,
  isMobile,
} = useHeader(props, emit)

const localeChange = (locale) => {
  onChangeLanguage(locale)
}

const userRole = computed(() => authStore.user?.details?.role || '')

const isCashDeskMatch = computed(
  () => selectedCashDesk.value?.gamingDateId === defaultGamingDateInfo.value?.id
)

const cashDeskDotClass = computed(() => ({
  'ops-status__dot--ok': isCashDeskMatch.value,
  'ops-status__dot--error': !isCashDeskMatch.value,
}))

const cashDeskMatchClass = computed(() => ({
  'ops-status__item--ok': isCashDeskMatch.value,
  'ops-status__item--error': !isCashDeskMatch.value,
}))

const cashdeskMetricClass = computed(() => {
  if (!defaultGamingDateInfo.value) return ''
  return defaultGamingDateInfo.value.cashdeskInGamingDateCount ===
    defaultGamingDateInfo.value.cashdeskCount
    ? 'ops-status__metric--ok'
    : 'ops-status__metric--error'
})

const liveTableMetricClass = computed(() => {
  if (!defaultGamingDateInfo.value) return ''
  return defaultGamingDateInfo.value.liveTableCount ===
    defaultGamingDateInfo.value.allLiveTableCount
    ? 'ops-status__metric--ok'
    : 'ops-status__metric--warn'
})
</script>
<style scoped lang="scss">
.app-header-shell {
  box-shadow:
    0 4px 14px -2px rgba(15, 34, 58, 0.14),
    0 2px 6px -1px rgba(15, 34, 58, 0.1);
}

:global(.body--dark) .app-header-shell {
  box-shadow:
    0 4px 14px -2px rgba(0, 0, 0, 0.35),
    0 2px 6px -1px rgba(0, 0, 0, 0.22);
}

.app-header-content {
  min-height: 100%;
}

.header-user-profile {
  flex-shrink: 0;
  align-self: stretch;
  height: auto;
  min-height: 100%;
  border-radius: 0;
  background-color: #f3f3f9;

  margin-right: 10px;

  :deep(.q-btn__content) {
    height: 100%;
  }

  &:hover {
    background-color: #f0f1f3;
  }

  &__inner {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 12px;
  }

  &__avatar {
    flex-shrink: 0;
    background-color: #f4f8f9;
    color: #1f2937;
    font-weight: 600;
    font-size: 12px;
  }

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
    text-align: left;
  }

  &__name {
    font-weight: 700;
    font-size: 14px;
    color: #313539;
  }

  &__role {
    font-weight: 400;
    font-size: 12px;
    color: #828690;
    margin-top: 2px;
  }
}

:global(.body--dark) .header-user-profile {
  background-color: #32383e;

  &:hover {
    background-color: #3a4148;
  }

  .header-user-profile__name {
    color: #e8eaed;
  }

  .header-user-profile__role {
    color: #9aa0a6;
  }
}

/* ---------------------------------------------------------------------------
 * Header status indicator (cash desk + gaming date + live tables/cashdesks)
 * Minimal inline style: no background cards, status conveyed via dot/numbers.
 * ------------------------------------------------------------------------- */
.ops-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  line-height: 1;
  color: #4b5563;
  user-select: none;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    border-radius: 6px;
    transition: background-color 0.15s ease;

    &--clickable {
      cursor: pointer;

      &:hover {
        background-color: rgba(15, 34, 58, 0.06);
      }
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;

    &--ok {
      background-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
    }

    &--error {
      background-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
    }
  }

  &__name {
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
  }

  &__date {
    font-weight: 400;
    color: #6b7280;
    font-size: 12px;
    white-space: nowrap;
  }

  &__divider {
    display: inline-block;
    width: 1px;
    height: 16px;
    background-color: rgba(15, 34, 58, 0.12);
    flex-shrink: 0;
  }

  &__icon {
    color: #6b7280;
    flex-shrink: 0;
  }

  &__label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    text-transform: capitalize;
  }

  &__metric {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    font-size: 13px;

    &-sep {
      color: #9ca3af;
      font-weight: 400;
      margin: 0 1px;
    }

    &-total {
      color: #9ca3af;
      font-weight: 500;
    }

    &--ok .ops-status__metric-current,
    &--ok {
      color: #059669;
    }

    &--warn .ops-status__metric-current,
    &--warn {
      color: #d97706;
    }

    &--error .ops-status__metric-current,
    &--error {
      color: #dc2626;
    }
  }

  &__action {
    margin-left: 2px;
    color: #6b7280;

    :deep(.q-icon) {
      font-size: 16px;
    }

    &:hover {
      color: #1f2937;
    }
  }
}

:global(.body--dark) .ops-status {
  color: #cbd5e1;

  .ops-status__item--clickable:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }

  .ops-status__name {
    color: #f1f5f9;
  }

  .ops-status__date {
    color: #94a3b8;
  }

  .ops-status__divider {
    background-color: rgba(255, 255, 255, 0.12);
  }

  .ops-status__icon,
  .ops-status__label {
    color: #94a3b8;
  }

  .ops-status__metric-sep,
  .ops-status__metric-total {
    color: #64748b;
  }

  .ops-status__metric--ok .ops-status__metric-current,
  .ops-status__metric--ok {
    color: #34d399;
  }

  .ops-status__metric--warn .ops-status__metric-current,
  .ops-status__metric--warn {
    color: #fbbf24;
  }

  .ops-status__metric--error .ops-status__metric-current,
  .ops-status__metric--error {
    color: #f87171;
  }

  .ops-status__action {
    color: #94a3b8;

    &:hover {
      color: #f1f5f9;
    }
  }
}
</style>
