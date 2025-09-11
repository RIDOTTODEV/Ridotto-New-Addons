<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md" square>
      <q-card-section class="row justify-between">
        <div class="text-h6">
          {{ $t('settings') }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="authStore.saveDefaultSettings" class="row">
          <div class="col-3 q-pa-xs">
            <div class="text-caption">
              {{ $t('defaultCurrency') }}
              <span class="text-negative">*</span>
            </div>
            <q-select
              v-model="defaultSettings.DefaultCurrencyId"
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
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()
const { defaultSettings } = storeToRefs(authStore)

const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
</script>

<style scoped></style>
