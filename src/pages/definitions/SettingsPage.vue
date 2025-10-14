<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md">
      <q-card-section class="row justify-between">
        <div class="text-h6">
          {{ $t('settings') }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form @submit="authStore.saveAddonGeneralSettings" class="row">
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('defaultCurrency') }}
              <span class="text-negative">*</span>
            </div>
            <q-select
              v-model="addonGeneralSettings.DefaultCurrencyId"
              outlined
              dense
              :options="getCurrenciesWithFlags"
              option-value="id"
              :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              clearable
              class="super-small"
              hide-bottom-space
              behavior="menu"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-img
                        :src="scope.opt.flag"
                        fit="contain"
                        width="20px"
                        height="20px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="text-subtitle2">
                  <q-img
                    :src="scope.opt.flag"
                    fit="contain"
                    width="20px"
                    height="20px"
                    class="q-mr-sm"
                  />
                  {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                </div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('defaultLocale') }}
              <span class="text-negative">*</span>
            </div>
            <q-select
              v-model="addonGeneralSettings.DefaultLocale"
              :options="locales"
              dense
              map-options
              emit-value
              option-value="lang"
              option-label="title"
              hide-bottom-space
              behavior="menu"
              class="super-small"
              outlined
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
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('sigaretteReportTags') }}
              <span class="text-negative">*</span>
            </div>
            <q-select
              multiple
              v-model="addonGeneralSettings.sigaretteReportTags"
              outlined
              dense
              :options="sigaretteReportTags"
              option-value="id"
              option-label="name"
              map-options
              emit-value
              class="super-small"
              hide-bottom-space
              behavior="menu"
              lazy-rules
              reactive-rules
              :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
            />
          </div>
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('CashierPassword') }}
              <span class="text-negative"></span>
            </div>
            <q-input
              v-model="addonGeneralSettings.CashierPassword"
              outlined
              dense
              :type="isPwdCashier ? 'password' : 'text'"
              class="super-small"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdCashier ? 'o_visibility' : 'o_visibility_off'"
                  @click="isPwdCashier = !isPwdCashier"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('PitbossPassword') }}
              <span class="text-negative"></span>
            </div>
            <q-input
              v-model="addonGeneralSettings.PitbossPassword"
              outlined
              dense
              class="super-small"
              :type="isPwdPitboss ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdPitboss ? 'o_visibility' : 'o_visibility_off'"
                  @click="isPwdPitboss = !isPwdPitboss"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('Default Player Transaction Location') }}
              <span class="text-negative">*</span>
            </div>
            <q-select-box
              v-model="addonGeneralSettings.DefaultPlayerTransactionLocationId"
              :options="locations"
              option-value="id"
              option-label="name"
              hide-bottom-space
              :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
            />
          </div>
          <div class="col-12 q-pa-xs flex justify-start q-mt-lg">
            <q-btn
              unelevated
              type="submit"
              color="primary"
              class="float-right"
              :label="$t('save')"
              no-wrap
              no-caps
              icon="save"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { posApi } from 'boot/axios'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useMainStore } from 'src/stores/main-store'
import { useDefinitionStore } from 'src/stores/definition-store'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()
const { addonGeneralSettings } = storeToRefs(authStore)
const definitionStore = useDefinitionStore()
const { locations } = storeToRefs(definitionStore)
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
const mainStore = useMainStore()
const { locales } = storeToRefs(mainStore)
const sigaretteReportTags = ref([])
const isPwdCashier = ref(true)
const isPwdPitboss = ref(true)
onMounted(async () => {
  await posApi.get('/api/Tag/GetAll').then(({ data }) => {
    sigaretteReportTags.value = data.data
  })
  await definitionStore.fetchLocations()
})
</script>

<style scoped></style>
