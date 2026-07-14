<template>
  <div class="test-form-4-page">
    <div class="tx-shell">
      <!-- Card header -->
      <div class="tx-header">
        <div class="tx-header-icon">
          <Wallet :size="16" />
        </div>
        <div class="tx-header-content">
          <h2 class="tx-header-title">Kasa Transaction İşlemi</h2>
          <p class="tx-header-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <!-- Master toolbar: tek satır, kompakt -->
      <div class="tx-master">
        <div class="tx-master-grid">
          <div class="tx-field tx-field--ref">
            <label>Ref <span class="req">*</span></label>
            <InputText
              v-model="master.referenceNo"
              placeholder="TRX-2026-001"
              fluid
            />
          </div>
          <div class="tx-field">
            <label>Date <span class="req">*</span></label>
            <DatePicker
              v-model="master.transactionDate"
              dateFormat="dd/mm/yy"
              showIcon
              iconDisplay="input"
              fluid
            />
          </div>
          <div class="tx-field">
            <label>Branch <span class="req">*</span></label>
            <Select
              v-model="master.branch"
              :options="branchOptions"
              option-label="label"
              option-value="value"
              placeholder="—"
              fluid
            />
          </div>
          <div class="tx-field tx-field--narrow">
            <label>Cur</label>
            <Select
              v-model="master.currency"
              :options="currencyOptions"
              option-label="label"
              option-value="value"
              fluid
            />
          </div>
          <div class="tx-field">
            <label>Priority</label>
            <Select
              v-model="master.priority"
              :options="priorityOptions"
              option-label="label"
              option-value="value"
              fluid
            />
          </div>
          <div class="tx-field tx-field--note">
            <label>Note</label>
            <InputText
              v-model="master.note"
              placeholder="Optional..."
              fluid
            />
          </div>
        </div>
      </div>

      <!-- Hızlı ekleme çubuğu -->
      <div class="tx-quickadd">
        <span class="tx-quickadd-label">Add</span>
        <button
          v-for="(type, i) in appendableTypes"
          :key="type.value"
          type="button"
          class="tx-quickadd-btn"
          :class="`tx-quickadd-btn--${type.value}`"
          :title="`${type.label} (Alt+${i + 1})`"
          @click="addSubForm(type.value)"
        >
          <i :class="type.icon"></i>
          <span>{{ type.label }}</span>
          <kbd>{{ i + 1 }}</kbd>
        </button>
        <div class="tx-quickadd-spacer"></div>
        <span class="tx-quickadd-hint">
          <i class="pi pi-info-circle"></i>
          Alt+1..5 hızlı ekle
        </span>
      </div>

      <!-- Transaction satırları -->
      <div v-if="subForms.length" class="tx-rows">
        <div
          v-for="(form, index) in subForms"
          :key="form.id"
          class="tx-row"
          :class="`tx-row--${form.type}`"
        >
          <span class="tx-row-label">{{ typeMeta[form.type].label }}</span>

          <div class="tx-row-marker" :title="typeMeta[form.type].label">
            <i :class="typeMeta[form.type].icon"></i>
            <span class="tx-row-idx">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>

          <div class="tx-row-grid">
            <div class="tx-field">
              <label>Amount <span class="req">*</span></label>
              <InputNumber
                v-model="form.amount"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                placeholder="0.00"
                fluid
              />
            </div>
            <div class="tx-field tx-field--narrow">
              <label>Cur</label>
              <Select
                v-model="form.currency"
                :options="currencyOptions"
                option-label="label"
                option-value="value"
                fluid
              />
            </div>

            <template v-if="form.type === 'inout'">
              <div class="tx-field">
                <label>Direction</label>
                <Select
                  v-model="form.direction"
                  :options="directionOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="—"
                  fluid
                />
              </div>
              <div class="tx-field">
                <label>Source</label>
                <InputText v-model="form.source" placeholder="Cashdesk / vault" fluid />
              </div>
              <div class="tx-field">
                <label>Reference</label>
                <InputText v-model="form.reference" placeholder="REF-001" fluid />
              </div>
            </template>

            <template v-else-if="form.type === 'cashdesk'">
              <div class="tx-field">
                <label>From</label>
                <InputText v-model="form.fromCashdesk" placeholder="Cashdesk A" fluid />
              </div>
              <div class="tx-field">
                <label>To</label>
                <InputText v-model="form.toCashdesk" placeholder="Cashdesk B" fluid />
              </div>
              <div class="tx-field">
                <label>Handler</label>
                <InputText v-model="form.handler" placeholder="Handler name" fluid />
              </div>
            </template>

            <template v-else-if="form.type === 'exchange'">
              <div class="tx-field">
                <label>To Currency</label>
                <Select
                  v-model="form.toCurrency"
                  :options="currencyOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="—"
                  fluid
                />
              </div>
              <div class="tx-field">
                <label>Rate</label>
                <InputNumber
                  v-model="form.rate"
                  :minFractionDigits="4"
                  :maxFractionDigits="4"
                  placeholder="0.0000"
                  fluid
                />
              </div>
              <div class="tx-field">
                <label>Reference</label>
                <InputText v-model="form.reference" placeholder="EXC-001" fluid />
              </div>
            </template>

            <template v-else-if="form.type === 'bank'">
              <div class="tx-field">
                <label>Bank Name</label>
                <InputText v-model="form.bankName" placeholder="Bank name" fluid />
              </div>
              <div class="tx-field">
                <label>Account No</label>
                <InputText v-model="form.accountNo" placeholder="IBAN / Acct" fluid />
              </div>
              <div class="tx-field">
                <label>Reference</label>
                <InputText v-model="form.reference" placeholder="BNK-001" fluid />
              </div>
            </template>

            <template v-else-if="form.type === 'other'">
              <div class="tx-field">
                <label>Category</label>
                <InputText v-model="form.category" placeholder="Category" fluid />
              </div>
              <div class="tx-field">
                <label>Reference</label>
                <InputText v-model="form.reference" placeholder="REF-001" fluid />
              </div>
              <div class="tx-field">
                <label>Approved By</label>
                <InputText v-model="form.approvedBy" placeholder="Approver" fluid />
              </div>
            </template>

            <div class="tx-field tx-field--desc">
              <label>Description</label>
              <InputText
                v-model="form.description"
                placeholder="Short description"
                fluid
              />
            </div>
          </div>

          <Button
            iconOnly
            aria-label="Remove"
            size="small"
            severity="secondary"
            text
            rounded
            class="tx-row-remove-btn"
            @click="removeSubForm(form.id)"
          >
            <Trash :size="14" />
          </Button>
        </div>
      </div>

      <div v-else class="tx-empty">
        <i class="pi pi-inbox"></i>
        <span>No transactions attached. Click a type above or press <kbd>Alt</kbd>+<kbd>1..5</kbd>.</span>
      </div>

      <!-- Sticky footer -->
      <div class="tx-footer">
        <div class="tx-summary">
          <div class="tx-summary-item">
            <span class="tx-summary-label">Items</span>
            <span class="tx-summary-value">{{ subForms.length }}</span>
          </div>
          <div class="tx-summary-divider"></div>
          <div class="tx-summary-item">
            <span class="tx-summary-label">Total Amount</span>
            <span class="tx-summary-value tx-summary-value--total">
              {{ formattedTotal }}
              <small>{{ master.currency }}</small>
            </span>
          </div>
        </div>
        <div class="tx-footer-actions">
          <Button
            label="Reset"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            class="tx-reset-btn"
            @click="resetForm"
          />
          <Button
            label="Save Pipeline"
            icon="pi pi-save"
            severity="success"
            class="tx-save-btn"
            @click="onSave"
          />
        </div>
      </div>
    </div>
  </div>

  <ChipGridNew />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ChipGridNew from './ChipGridNew.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { Trash, Wallet } from '@primeicons/vue'

const master = ref({
  referenceNo: '',
  transactionDate: new Date(),
  branch: null,
  currency: 'TRY',
  priority: 'normal',
  note: '',
})

const branchOptions = [
  { label: 'HQ - Istanbul', value: 'hq' },
  { label: 'Bodrum Resort', value: 'bodrum' },
  { label: 'Antalya Riviera', value: 'antalya' },
  { label: 'Girne Grand', value: 'girne' },
]

const currencyOptions = [
  { label: 'TRY', value: 'TRY' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
]

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

const directionOptions = [
  { label: 'In', value: 'in' },
  { label: 'Out', value: 'out' },
]

const typeMeta = {
  inout: { label: 'Inout', icon: 'pi pi-arrow-right-arrow-left' },
  cashdesk: { label: 'Cashdesk Transfer', icon: 'pi pi-briefcase' },
  exchange: { label: 'Exchange', icon: 'pi pi-sync' },
  bank: { label: 'Bank Transfer', icon: 'pi pi-building' },
  other: { label: 'Other Transfer', icon: 'pi pi-ellipsis-h' },
}

const appendableTypes = [
  { value: 'inout', label: 'Inout', icon: 'pi pi-arrow-right-arrow-left' },
  { value: 'cashdesk', label: 'Cashdesk Transfer', icon: 'pi pi-briefcase' },
  { value: 'exchange', label: 'Exchange', icon: 'pi pi-sync' },
  { value: 'bank', label: 'Bank Transfer', icon: 'pi pi-building' },
  { value: 'other', label: 'Other Transfer', icon: 'pi pi-ellipsis-h' },
]

const subForms = ref([])
let counter = 0

const templates = {
  inout: () => ({
    type: 'inout',
    amount: null,
    currency: master.value.currency,
    direction: null,
    source: '',
    reference: '',
    description: '',
  }),
  cashdesk: () => ({
    type: 'cashdesk',
    amount: null,
    currency: master.value.currency,
    fromCashdesk: '',
    toCashdesk: '',
    handler: '',
    description: '',
  }),
  exchange: () => ({
    type: 'exchange',
    amount: null,
    currency: master.value.currency,
    toCurrency: null,
    rate: null,
    reference: '',
    description: '',
  }),
  bank: () => ({
    type: 'bank',
    amount: null,
    currency: master.value.currency,
    bankName: '',
    accountNo: '',
    reference: '',
    description: '',
  }),
  other: () => ({
    type: 'other',
    amount: null,
    currency: master.value.currency,
    category: '',
    reference: '',
    approvedBy: '',
    description: '',
  }),
}

function addSubForm(type) {
  const factory = templates[type]
  if (!factory) return
  counter += 1
  subForms.value.push({
    id: `NODE-${String(counter).padStart(3, '0')}`,
    ...factory(),
  })
}

function removeSubForm(id) {
  subForms.value = subForms.value.filter((f) => f.id !== id)
}

const formattedTotal = computed(() => {
  const total = subForms.value.reduce((acc, form) => acc + (Number(form.amount) || 0), 0)
  return total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

function resetForm() {
  master.value = {
    referenceNo: '',
    transactionDate: new Date(),
    branch: null,
    currency: 'TRY',
    priority: 'normal',
    note: '',
  }
  subForms.value = []
  counter = 0
}

function onSave() {
  const payload = {
    master: master.value,
    transactions: subForms.value,
  }
  console.log('Save payload:', payload)
}

function handleKeydown(e) {
  if (!e.altKey) return
  const idx = ['1', '2', '3', '4', '5'].indexOf(e.key)
  if (idx >= 0 && appendableTypes[idx]) {
    e.preventDefault()
    addSubForm(appendableTypes[idx].value)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.test-form-4-page {
  background: transparent;
  padding: 20px;
  display: flex;
  justify-content: center;
  font-family: 'Inter', 'Roboto', sans-serif;

  /* Light mode tokens */
  --tx-bg-card: #ffffff;
  --tx-bg-alt: #fafbfc;
  --tx-bg-soft: #f9fafb;
  --tx-bg-hover: #fafbfc;
  --tx-border: #e4e7ec;
  --tx-border-soft: #eef0f3;
  --tx-border-softer: #f2f4f7;
  --tx-text: #101828;
  --tx-text-strong: #344054;
  --tx-text-2: #475467;
  --tx-text-muted: #667085;
  --tx-text-subtle: #98a2b3;
  --tx-text-fade: #d0d5dd;
  --tx-inout-tint: #eef4ff;
  --tx-inout-tint-2: #dbe9ff;
  --tx-cashdesk-tint: #fef4e6;
  --tx-exchange-tint: #e7f8ef;
  --tx-bank-tint: #f0ecff;
  --tx-other-tint: #e0f7fa;
  --tx-shadow-rgb: 16, 24, 40;
}

.q-dark .test-form-4-page,
.body--dark .test-form-4-page {
  --tx-bg-card: #1a2033;
  --tx-bg-alt: #151b2b;
  --tx-bg-soft: #232b3e;
  --tx-bg-hover: #232b3e;
  --tx-border: #2d3548;
  --tx-border-soft: #232b3e;
  --tx-border-softer: #212840;
  --tx-text: #f2f4f7;
  --tx-text-strong: #e4e7ec;
  --tx-text-2: #d0d5dd;
  --tx-text-muted: #98a2b3;
  --tx-text-subtle: #667085;
  --tx-text-fade: #475467;
  --tx-inout-tint: rgba(47, 111, 235, 0.18);
  --tx-inout-tint-2: rgba(47, 111, 235, 0.28);
  --tx-cashdesk-tint: rgba(247, 144, 9, 0.18);
  --tx-exchange-tint: rgba(18, 183, 106, 0.18);
  --tx-bank-tint: rgba(122, 90, 248, 0.18);
  --tx-other-tint: rgba(8, 145, 178, 0.18);
  --tx-shadow-rgb: 0, 0, 0;
}

.tx-shell {
  width: 100%;
  max-width: 1360px;
  background: var(--tx-bg-card);
  border-radius: 12px;
  border: 1px solid var(--tx-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(var(--tx-shadow-rgb), 0.04),
    0 4px 12px rgba(var(--tx-shadow-rgb), 0.06),
    0 12px 32px rgba(var(--tx-shadow-rgb), 0.05);
}

/* Card header */
.tx-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--tx-border-soft);
  background: linear-gradient(180deg, var(--tx-bg-card) 0%, var(--tx-bg-alt) 100%);
}

.tx-header-icon {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--tx-inout-tint) 0%, var(--tx-inout-tint-2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--tx-inout-tint-2);
}

.tx-header-icon i,
.tx-header-icon svg {
  font-size: 14px;
  color: #2f6feb;
}

.tx-header-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.tx-header-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--tx-text);
  margin: 0;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.tx-header-subtitle {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--tx-text-subtle);
  margin: 0;
  line-height: 1.35;
  max-width: 720px;
}

/* Master toolbar */
.tx-master {
  padding: 10px 12px;
  border-bottom: 1px solid var(--tx-border-soft);
  background: var(--tx-bg-card);
}

.tx-master-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.2fr 0.55fr 0.8fr 2fr;
  gap: 8px 10px;
}

/* Field */
.tx-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.tx-field label {
  font-size: 10px;
  font-weight: 600;
  color: var(--tx-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 2px;
}

.req {
  color: #d92d20;
}

.tx-field--narrow {
  max-width: 100px;
}

/* Quick add bar */
.tx-quickadd {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--tx-border-soft);
  background: var(--tx-bg-card);
  flex-wrap: wrap;
}

.tx-quickadd-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--tx-text-subtle);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 2px;
}

.tx-quickadd-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  background: var(--tx-bg-card);
  border: 1px solid var(--tx-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--tx-text-strong);
  transition: all 0.12s ease;
  font-family: inherit;
}

.tx-quickadd-btn i {
  font-size: 11px;
  color: var(--tx-text-muted);
}

.tx-quickadd-btn kbd {
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--tx-bg-card);
  border: 1px solid var(--tx-border);
  color: var(--tx-text-subtle);
  line-height: 1;
}

.tx-quickadd-btn:hover {
  background: var(--tx-bg-card);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(var(--tx-shadow-rgb), 0.06);
}

.tx-quickadd-btn--inout:hover { border-color: #2f6feb; color: #2f6feb; }
.tx-quickadd-btn--inout:hover i { color: #2f6feb; }
.tx-quickadd-btn--cashdesk:hover { border-color: #f79009; color: #f79009; }
.tx-quickadd-btn--cashdesk:hover i { color: #f79009; }
.tx-quickadd-btn--exchange:hover { border-color: #12b76a; color: #12b76a; }
.tx-quickadd-btn--exchange:hover i { color: #12b76a; }
.tx-quickadd-btn--bank:hover { border-color: #7a5af8; color: #7a5af8; }
.tx-quickadd-btn--bank:hover i { color: #7a5af8; }
.tx-quickadd-btn--other:hover { border-color: #0891b2; color: #0891b2; }
.tx-quickadd-btn--other:hover i { color: #0891b2; }

.tx-quickadd-spacer {
  flex: 1;
}

.tx-quickadd-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: var(--tx-text-subtle);
}

.tx-quickadd-hint i {
  font-size: 11px;
}

/* Rows */
.tx-rows {
  background: var(--tx-bg-card);
  max-height: calc(100vh - 320px);
  overflow-y: auto;
}

.tx-row {
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 22px 12px 8px;
  border-bottom: 1px solid var(--tx-border-softer);
  transition: background 0.1s;
  position: relative;
}

.tx-row-label {
  position: absolute;
  top: 6px;
  left: 18px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  color: var(--tx-text-muted);
  pointer-events: none;
}

.tx-row--inout .tx-row-label { color: #2f6feb; }
.tx-row--cashdesk .tx-row-label { color: #f79009; }
.tx-row--exchange .tx-row-label { color: #12b76a; }
.tx-row--bank .tx-row-label { color: #7a5af8; }
.tx-row--other .tx-row-label { color: #0891b2; }

.tx-row:last-child {
  border-bottom: none;
}

.tx-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.tx-row--inout::before { background: #2f6feb; }
.tx-row--cashdesk::before { background: #f79009; }
.tx-row--exchange::before { background: #12b76a; }
.tx-row--bank::before { background: #7a5af8; }
.tx-row--other::before { background: #0891b2; }

.tx-row:hover {
  background: var(--tx-bg-alt);
}

.tx-row-marker {
  width: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border-radius: 6px;
  flex-shrink: 0;
  align-self: flex-end;
  height: 30px;
  margin-bottom: 0;
}

.tx-row-marker i {
  font-size: 13px;
}

.tx-row-idx {
  font-size: 9px;
  font-weight: 700;
  color: var(--tx-text-subtle);
  letter-spacing: 0.03em;
  line-height: 1;
}

.tx-row--inout .tx-row-marker { background: var(--tx-inout-tint); }
.tx-row--inout .tx-row-marker i { color: #2f6feb; }
.tx-row--cashdesk .tx-row-marker { background: var(--tx-cashdesk-tint); }
.tx-row--cashdesk .tx-row-marker i { color: #f79009; }
.tx-row--exchange .tx-row-marker { background: var(--tx-exchange-tint); }
.tx-row--exchange .tx-row-marker i { color: #12b76a; }
.tx-row--bank .tx-row-marker { background: var(--tx-bank-tint); }
.tx-row--bank .tx-row-marker i { color: #7a5af8; }
.tx-row--other .tx-row-marker { background: var(--tx-other-tint); }
.tx-row--other .tx-row-marker i { color: #0891b2; }

.tx-row-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.55fr 1fr 1fr 1fr 1.6fr;
  gap: 6px 8px;
  min-width: 0;
}

.tx-row-remove-btn {
  align-self: flex-end;
  flex-shrink: 0;
}

/* Empty state */
.tx-empty {
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--tx-text-subtle);
  font-size: 12.5px;
  border-bottom: 1px solid var(--tx-border-soft);
  background: var(--tx-bg-card);
}

.tx-empty i {
  font-size: 26px;
  color: var(--tx-text-fade);
}

.tx-empty kbd {
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--tx-bg-card);
  border: 1px solid var(--tx-border);
  color: var(--tx-text-muted);
}

/* Footer */
.tx-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--tx-border-soft);
  background: var(--tx-bg-alt);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tx-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tx-summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tx-summary-label {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--tx-text-subtle);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
}

.tx-summary-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--tx-text);
  line-height: 1;
}

.tx-summary-value--total {
  color: #039855;
  font-size: 17px;
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
}

.tx-summary-value--total small {
  font-size: 10px;
  color: var(--tx-text-muted);
  font-weight: 500;
}

.tx-summary-divider {
  width: 1px;
  height: 28px;
  background: var(--tx-border);
}

.tx-footer-actions {
  display: flex;
  gap: 8px;
}

/* Responsive */
@media (max-width: 1200px) {
  .tx-master-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .tx-row-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .tx-field--narrow {
    max-width: none;
  }
}

@media (max-width: 700px) {
  .tx-master-grid,
  .tx-row-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .tx-quickadd-hint {
    display: none;
  }
}

@media (max-width: 480px) {
  .tx-master-grid,
  .tx-row-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Only visual tweaks that theme preset can't handle */
.test-form-4-page .p-inputtext,
.test-form-4-page .p-select,
.test-form-4-page .p-datepicker-input,
.test-form-4-page .p-inputnumber-input {
  border-radius: 6px !important;
}

.test-form-4-page .p-button {
  border-radius: 6px !important;
}

.test-form-4-page .tx-save-btn.p-button {
  background: #039855;
  border-color: #039855;
  color: #fff;
  font-weight: 600;
  font-size: 12.5px;
  height: 36px;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(3, 152, 85, 0.25);
  transition: all 0.15s ease;
}

.test-form-4-page .tx-save-btn.p-button:hover {
  background: #027a48;
  border-color: #027a48;
  box-shadow: 0 2px 6px rgba(3, 152, 85, 0.3);
  transform: translateY(-1px);
}

.test-form-4-page .tx-save-btn.p-button:active {
  transform: translateY(0);
}

.test-form-4-page .tx-save-btn.p-button .p-button-icon {
  font-size: 13px;
}

.test-form-4-page .tx-reset-btn.p-button {
  height: 36px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 12.5px;
  color: var(--tx-text-2);
  border-color: var(--tx-text-fade);
  background: var(--tx-bg-card);
  transition: all 0.15s ease;
}

.test-form-4-page .tx-reset-btn.p-button:hover {
  background: var(--tx-bg-soft);
  border-color: var(--tx-text-subtle);
  color: var(--tx-text);
}
</style>
