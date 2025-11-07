<template>
  <q-header>
    <div class="grid grid-cols-[auto_1fr] md:py-1 py-2 gap-y-2 bg-gray-100">
      <div>
        <div class="flex justify-start items-center gap-x-2 px-2">
          <q-icon
            :name="!drawer ? 'menu' : 'east'"
            size="md"
            color="grey-7"
            class="cursor-pointer"
            @click="toggleDrawer"
            transition-show="scale"
            transition-hide="scale"
          />
          <SearchPlayerInput
            v-if="!isMobile || !drawer"
            class="super-small search-input"
            :placeholder="$t('search')"
            v-model="selectedUser"
            @onSelectPlayer="onSelectPlayer"
            @onClear="onClearPlayer"
            optionLabel="value"
          />
        </div>
      </div>
      <div v-if="!isMobile || !drawer">
        <div class="flex justify-end items-center px-2 gap-2">
          <div v-if="!isMobile">
            <q-btn flat padding="0px 5px" v-if="isAuthorityUser" no-wrap>
              <template v-slot:default>
                <div class="row">
                  <div
                    @click="bus.emit('setNewCashDesk')"
                    :style="
                      selectedCashDesk
                        ? {
                            backgroundColor:
                              selectedCashDesk?.gamingDateId === defaultGamingDateInfo?.id
                                ? '#108f3d'
                                : '#dc3545',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '3px',
                          }
                        : {}
                    "
                    class="cursor-pointer flex content-center q-mr-sm"
                  >
                    <div class="text-subtitle2">
                      <div class="flex items-center justify-between content-center">
                        <q-icon name="account_balance" size="18px" />
                        {{ selectedCashDesk.name }} -
                        <span class="q-ml-xs">{{ selectedCashDesk.gamingDate }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-subtitle2 flex items-center"
                    :style="
                      defaultGamingDateInfo
                        ? {
                            backgroundColor:
                              defaultGamingDateInfo?.cashdeskInGamingDateCount ===
                              defaultGamingDateInfo?.cashdeskCount
                                ? '#108f3d'
                                : '#dc3545',
                            color: 'white',
                            height: '31px',
                            borderRadius: '3px',
                            padding: '5px',
                          }
                        : {}
                    "
                  >
                    <q-icon name="o_dashboard" size="21px" />
                    {{ defaultGamingDateInfo?.cashdeskInGamingDateCount }}/{{
                      defaultGamingDateInfo?.cashdeskCount
                    }}
                    <div
                      v-if="
                        defaultGamingDateInfo?.cashdeskInGamingDateCount !==
                        defaultGamingDateInfo?.cashdeskCount
                      "
                      class="q-ml-sm cursor-pointer"
                      v-el-perms="'Addon.CageOperations.GamingDateChangeUpdate'"
                      @click="changeCashDeskGamingDate"
                    >
                      <q-icon name="calendar_month" size="15px" class="q-mr-xs" />
                      <span class="text-caption text-weight-medium">{{
                        $t('changeGamingDate')
                      }}</span>
                    </div>
                    <q-tooltip class="text-caption bg-blue-grey-8">
                      {{ $t('Güncel oyun tarihindeki kasaların sayısı') }}
                    </q-tooltip>
                  </div>

                  <div
                    class="text-subtitle2 flex items-center q-ml-sm"
                    :style="
                      defaultGamingDateInfo
                        ? {
                            backgroundColor:
                              defaultGamingDateInfo?.allLiveTableCount ===
                              defaultGamingDateInfo?.liveTableCount
                                ? '#108f3d'
                                : '#9da141',
                            color: 'white',
                            height: '31px',
                            borderRadius: '3px',
                            padding: '5px',
                          }
                        : {}
                    "
                  >
                    <q-icon name="border_clear" size="21px" />
                    {{ defaultGamingDateInfo?.liveTableCount }}/{{
                      defaultGamingDateInfo?.allLiveTableCount
                    }}
                    <div
                      v-if="
                        defaultGamingDateInfo?.liveTableCount !==
                        defaultGamingDateInfo?.allLiveTableCount
                      "
                      class="q-ml-xs cursor-pointer"
                      v-el-perms="'Addon.CageOperations.GamingDateChangeUpdate'"
                      @click="router.push({ name: 'tableOperations' })"
                    >
                      <q-icon name="o_change_circle" size="22px" />
                      <q-tooltip class="text-caption bg-blue-grey-8">
                        {{ $t('changeGamingDate') }}
                      </q-tooltip>
                    </div>
                    <q-tooltip class="text-caption bg-blue-grey-8">
                      {{ $t('Güncel oyun tarihindeki masaların sayısı') }}
                    </q-tooltip>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>
          <ExchangeCalculation />
          <q-btn
            size="13px"
            color="grey-2"
            text-color="dark"
            unelevated
            icon="o_person"
            class="text-capitalize"
            :label="getUserNameSurname.shortName"
          >
            <q-menu style="margin-top: 10px !important">
              <div class="row no-wrap q-pa-md">
                <div class="column w-full">
                  <q-toggle
                    v-model="userSettings.darkMode"
                    label="Dark Mode"
                    @click="onToggleDarkMode"
                  />
                  <q-toggle
                    v-model="userSettings.fullScreen"
                    label="Screen Mode"
                    @click="$q.fullscreen.toggle()"
                  />
                  <q-select
                    v-if="isAuthorityUser"
                    v-model="userAddonSettings.DefaultCurrencyId"
                    :options="currencies"
                    map-options
                    emit-value
                    option-value="id"
                    :option-label="(val) => val.symbol + ' ' + val.name"
                    label="Default Currency"
                    @update:model-value="(val) => authStore.saveUserCurrency(val, true)"
                    dense
                  />
                  <q-select
                    v-model="userSettings.selectedLocale"
                    :options="locales"
                    label="Default Locale"
                    @update:model-value="localeChange"
                    dense
                    map-options
                    emit-value
                    option-value="lang"
                    option-label="title"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>
                            <q-img
                              :src="scope.opt.iconPath"
                              fit="contain"
                              width="20px"
                              height="20px"
                              class="q-mr-sm"
                            />
                            {{ scope.opt.title }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:selected-item="scope">
                      <div class="text-subtitle2">
                        <q-img
                          :src="scope.opt.iconPath"
                          fit="contain"
                          width="20px"
                          height="20px"
                          class="q-mr-sm"
                        />
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

                  <q-btn
                    v-if="isAuthorityUser"
                    color="grey-2"
                    text-color="dark"
                    label="Ridotto"
                    unelevated
                    icon="o_language"
                    size="13px"
                    no-caps
                    class="q-mt-sm full-width"
                    @click="redirectToRidotto"
                  />
                  <q-btn
                    v-if="isAuthorityUser"
                    color="grey-2"
                    text-color="dark"
                    label="Inspector"
                    unelevated
                    icon="login"
                    size="13px"
                    no-caps
                    class="q-mt-sm full-width"
                    @click="bus.emit('triggerDraw')"
                    to="/inspector"
                    target="_blank"
                  />
                  <q-btn
                    no-caps
                    color="red-10"
                    :label="$t('logout')"
                    size="13px"
                    v-close-popup
                    icon="logout"
                    @click="mainOidc.signOut()"
                    class="full-width q-mt-md"
                    unelevated
                  />
                </div>
              </div>
              <div class="w-full full-width bg-blue-grey-1 q-card--bordered">
                <div v-if="isMobile" class="row col-12 w-full">
                  <div class="col-12 q-pa-xs">
                    <div class="text-caption">
                      <span class="font-bold pr-2">{{ $t('Gaming Date') }}:</span
                      >{{ selectedCashDesk.gamingDate }}
                    </div>
                  </div>
                  <div class="col-6 q-pa-xs">
                    <div
                      @click="bus.emit('setNewCashDesk')"
                      :class="{
                        'bg-green-8 text-white':
                          selectedCashDesk?.gamingDateId === defaultGamingDateInfo?.id,
                        'bg-negative text-white':
                          selectedCashDesk?.gamingDateId !== defaultGamingDateInfo?.id,
                        'p-1 rounded-sm': true,
                      }"
                      class="cursor-pointer flex content-center flex-col text-caption"
                    >
                      <div class="flex items-center gap-x-2">
                        <q-icon name="account_balance" size="18px" /> {{ selectedCashDesk.name }}
                      </div>
                    </div>
                  </div>
                  <div class="col q-pa-xs">
                    <div
                      class="flex items-center text-caption"
                      :class="{
                        'bg-green-8 text-white':
                          defaultGamingDateInfo?.cashdeskInGamingDateCount ===
                          defaultGamingDateInfo?.cashdeskCount,
                        'bg-negative text-white':
                          defaultGamingDateInfo?.cashdeskInGamingDateCount !==
                          defaultGamingDateInfo?.cashdeskCount,
                        'p-1 rounded-sm': true,
                      }"
                      @click="changeCashDeskGamingDate"
                    >
                      <q-icon
                        :name="
                          defaultGamingDateInfo?.cashdeskInGamingDateCount ===
                          defaultGamingDateInfo?.cashdeskCount
                            ? 'o_dashboard'
                            : 'calendar_month'
                        "
                        size="18px"
                      />
                      {{ defaultGamingDateInfo?.cashdeskInGamingDateCount }}/{{
                        defaultGamingDateInfo?.cashdeskCount
                      }}
                    </div>
                  </div>
                  <div class="col q-pa-xs">
                    <div
                      class="flex items-center text-caption"
                      :class="{
                        'bg-green-8 text-white':
                          defaultGamingDateInfo?.allLiveTableCount ===
                          defaultGamingDateInfo?.liveTableCount,
                        'bg-negative text-white':
                          defaultGamingDateInfo?.allLiveTableCount !==
                          defaultGamingDateInfo?.liveTableCount,
                        'p-1 rounded-sm': true,
                      }"
                      @click="router.push({ name: 'tableOperations' })"
                    >
                      <q-icon
                        :name="
                          defaultGamingDateInfo?.allLiveTableCount ===
                          defaultGamingDateInfo?.liveTableCount
                            ? 'border_clear'
                            : 'o_change_circle'
                        "
                        size="18px"
                      />
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
      </div>
    </div>
  </q-header>
</template>
<script setup>
import { useHeader } from 'src/composables/layout/useHeader'
import ExchangeCalculation from 'src/components/atoms/ExchangeCalculation.vue'
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
</script>
<style scoped lang="scss"></style>
