<template>
  <q-page class="flex justify-center items-start q-pa-md bg-[#f2f3f6]">
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <q-form @submit="onSubmitMasterForm" ref="masterFormRef">
        <!-- Header -->
        <div class="q-pa-md border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <div class="text-lg font-bold text-slate-900 tracking-tight q-my-none text-subtitle1">
              {{ $t('globalTransactionLedger') }}
            </div>
            <p class="text-xs text-slate-400 q-mt-xs q-mb-none">
              {{ $t('ledgerSubtitle') }}
            </p>
          </div>
        </div>

        <div class="q-pa-md flex flex-col" style="gap: 1.5rem">
          <!-- Master Specifications -->
          <div>
  
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <q-input
                v-model="masterRefNo"
                outlined
                dense
                :label="$t('masterReferenceNo')"
                placeholder="e.g., MSTR-2026-HQ"
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
              />
              <q-input
                v-model="masterDate"
                outlined
                dense
                :label="$t('globalDateTime')"
                type="datetime-local"
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
              />
            </div>
          </div>

          <!-- Linked Transaction Stream -->
          <div class="flex flex-col" style="gap: 1rem">
            <div id="sub-forms-container" class="flex flex-col" style="gap: 1rem">
              <!-- Dynamic Sub-Form Cards -->
              <div
                v-for="form in subForms"
                :key="form.id"
                class="border border-slate-200 bg-slate-200/40 rounded-2xl q-pa-md relative flex flex-col shadow-xs transition-all duration-200"
                style="gap: 0.75rem"
              >
                <q-btn
                  flat
                  dense
                  icon="close"
                  size="sm"
                  class="absolute top-0 right-0 q-ma-sm text-slate-400"
                  @click="removeSubForm(form.id)"
                />

                <div class="flex items-center" style="gap: 0.5rem">
                  <span class="text-xs font-bold text-slate-800 tracking-tight">
                    {{ form.title }}
                  </span>
                  <span class="text-[9px] font-mono bg-slate-200 text-slate-600 q-px-xs q-py-xs rounded uppercase">
                    {{ $t('node') }} #{{ form.nodeNumber }}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <!-- Amount -->
                  <q-input
                    v-model="form.amount"
                    outlined
                    dense
                    :label="$t('amount')"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    :rules="[(val) => !!val || $t('requiredField')]"
                    hide-bottom-space
                    class="super-small bg-white"
                  />

                  <!-- Currency -->
                  <q-select
                    v-model="form.currency"
                    outlined
                    dense
                    :label="$t('currency')"
                    :options="currencyOptions"
                    :rules="[(val) => !!val || $t('requiredField')]"
                    hide-bottom-space
                    behavior="menu"
                    class="super-small"
                  />

                  <!-- Type-Specific Fields -->
                  <template v-if="form.type === 'cage'">
                    <q-input
                      v-model="form.cageCode"
                      outlined
                      dense
                      :label="$t('cageCode')"
                      placeholder="MAIN-CAGE"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                    <q-input
                      v-model="form.officer"
                      outlined
                      dense
                      :label="$t('officer')"
                      placeholder="Ahmet Y."
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                  </template>

                  <template v-if="form.type === 'chip'">
                    <q-input
                      v-model="form.inventoryType"
                      outlined
                      dense
                      :label="$t('inventoryType')"
                      placeholder="Cash Chip"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                    <q-input
                      v-model="form.tableNo"
                      outlined
                      dense
                      :label="$t('tableNo')"
                      placeholder="Table 05"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                  </template>

                  <template v-if="form.type === 'petty'">
                    <q-input
                      v-model="form.category"
                      outlined
                      dense
                      :label="$t('category')"
                      placeholder="Office Supplies"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                    <q-input
                      v-model="form.receiptNo"
                      outlined
                      dense
                      :label="$t('receiptNo')"
                      placeholder="INV-9901"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                       
                    />
                  </template>

                  <template v-if="form.type === 'player'">
                    <q-input
                      v-model="form.playerIdField"
                      outlined
                      dense
                      :label="$t('playerId')"
                      placeholder="PLY-7712"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                    <q-input
                      v-model="form.fullName"
                      outlined
                      dense
                      :label="$t('fullName')"
                      placeholder="John Doe"
                      :rules="[(val) => !!val || $t('requiredField')]"
                      hide-bottom-space
                      class="super-small"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Append New Form Component -->
          <div class="q-pt-md border-t border-slate-100 flex flex-col items-start" style="gap: 0.75rem">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {{ $t('appendNewFormComponent') }}
            </span>
            <div class="flex flex-wrap" style="gap: 0.5rem">
              <q-btn
                unelevated
                no-caps
                size="13px"
                class="bg-grey-3"
                @click="appendSubForm('cage')"
              >
                <q-icon name="account_balance" class="q-mr-xs text-slate-700" size="14px" />
                + {{ $t('cageTransaction') }}
              </q-btn>
              <q-btn
                unelevated
                no-caps
                size="13px"
                class="bg-grey-3 "
                @click="appendSubForm('chip')"
              >
                <q-icon name="currency_bitcoin" class="q-mr-xs text-slate-700" size="14px" />
                + {{ $t('chipTransaction') }}
              </q-btn>
              <q-btn
                unelevated
                no-caps
                size="13px"
                class="bg-grey-3 "
                @click="appendSubForm('petty')"
              >
                <q-icon name="account_balance_wallet" class="q-mr-xs text-slate-700" size="14px" />
                + {{ $t('pettyCash') }}
              </q-btn>
              <q-btn
                unelevated
                no-caps
                size="13px"
                class="bg-grey-3 "
                @click="appendSubForm('player')"
              >
                <q-icon name="person" class="q-mr-xs text-slate-700" size="14px" />
                + {{ $t('playerTransaction') }}
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Footer / Submit -->
        <div class="q-pa-md bg-slate-50/70 border-t border-slate-100 flex justify-end">
          <q-btn
            type="submit"
            unelevated
            no-caps
            size="13px"
            color="blue-grey-8"
            class="rounded-lg"
            padding="8px 18px"
          >
            {{ $t('commitAllTransactions') }}
          </q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from 'src/boot/i18n'

const $q = useQuasar()
const masterFormRef = ref(null)

// Master form values
const masterRefNo = ref('')
const masterDate = ref(new Date().toISOString().slice(0, 16))

// Currency options
const currencyOptions = ref(['TRY', 'USD'])

// Sub-form tracking
const subForms = ref([])
let formCounter = 0

// Sub-form templates defining field defaults for each transaction type
const subFormTemplates = {
  cage: {
    title: 'Cage Transaction Component',
    getFields: () => ({
      type: 'cage',
      amount: null,
      currency: 'TRY',
      cageCode: '',
      officer: '',
    }),
  },
  chip: {
    title: 'Chip Transaction Component',
    getFields: () => ({
      type: 'chip',
      amount: null,
      currency: 'TRY',
      inventoryType: '',
      tableNo: '',
    }),
  },
  petty: {
    title: 'Petty Cash Component',
    getFields: () => ({
      type: 'petty',
      amount: null,
      currency: 'TRY',
      category: '',
      receiptNo: '',
    }),
  },
  player: {
    title: 'Player Transaction Component',
    getFields: () => ({
      type: 'player',
      amount: null,
      currency: 'TRY',
      playerIdField: '',
      fullName: '',
    }),
  },
}

function appendSubForm(type) {
  formCounter++
  const template = subFormTemplates[type]
  if (!template) return

  subForms.value.push({
    id: formCounter,
    nodeNumber: formCounter,
    title: template.title,
    ...template.getFields(),
  })
}

function removeSubForm(id) {
  const index = subForms.value.findIndex((f) => f.id === id)
  if (index !== -1) {
    subForms.value.splice(index, 1)
  }
}

function onSubmitMasterForm() {
  if (!masterRefNo.value) {
    $q.notify({
      message: i18n.global.t('requiredField'),
      type: 'warning',
      position: 'top',
    })
    return
  }

  const payload = {
    masterRefNo: masterRefNo.value,
    masterDate: masterDate.value,
    transactions: subForms.value.map((form) => {
      // Clean up internal tracking fields before sending
      const {  type, ...fields } = form
      return { type, ...fields }
    }),
  }

  $q.notify({
    message: `${i18n.global.t('commitPipelineSuccessful')}\n${i18n.global.t('masterReference')}: ${payload.masterRefNo}\n${i18n.global.t('totalAttachedForms')}: ${payload.transactions.length}`,
    type: 'positive',
    position: 'top',
    timeout: 3000,
  })

 
}
</script>

<style scoped>
.super-small {
  font-size: 12px;
}

/* background color for input white of all #sub-forms-container sub forms */
#sub-forms-container .q-field__inner {
  background-color: white!important;
}
</style>
