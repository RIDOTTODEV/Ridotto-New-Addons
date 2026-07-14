<script setup>
import { ref, computed } from 'vue'
import Fieldset from 'primevue/fieldset'

const formatPrice = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)
}

const apiResponse = {
  totalCount: 3,
  data: [
    {
      name: 'Chip',
      color: '#FF0000',
      type: 'Chip',
      currencyId: 2,
      currencyName: 'EUR',
      denominations: [
        { name: "5000'lik", code: 'T', value: 5000, id: 21 },
        { name: "1000'lik", code: 'G', value: 1000, id: 20 },
        { name: "500 'lük", code: 'M', value: 500, id: 5 },
        { name: "100 'lük", code: 'A', value: 100, id: 4 },
        { name: "25 ' lik", code: 'P', value: 25, id: 2 },
        { name: "1 'lik", code: '-', value: 1, id: 16 },
      ],
      id: 1,
    },
    {
      name: 'Plaque',
      color: '#00A86B',
      type: 'Plaque',
      currencyId: 2,
      currencyName: 'EUR',
      denominations: [
        { name: "5000'lik", code: 'PLQ-T', value: 5000, id: 9 },
        { name: "1000'lik", code: 'PLQ-G', value: 1000, id: 8 },
        { name: "500'lük", code: 'PLQ-M', value: 500, id: 7 },
        { name: "100'lük", code: 'PLQ-A', value: 100, id: 6 },
      ],
      id: 2,
    },
    {
      name: 'Pasha Chip',
      color: '#0f172a',
      type: 'Chip',
      currencyId: 1,
      currencyName: 'TL',
      denominations: [
        { name: '200', code: '200', value: 200, id: 26 },
        { name: '100', code: '100', value: 100, id: 25 },
        { name: '50', code: '50', value: 50, id: 24 },
        { name: '20', code: '20', value: 20, id: 23 },
        { name: '10', code: '10', value: 10, id: 22 },
      ],
      id: 7,
    },
    {
      name: 'High Roller',
      color: '#7C3AED',
      type: 'Chip',
      currencyId: 3,
      currencyName: 'USD',
      denominations: [
        { name: "25000'lik", code: 'HR-XL', value: 25000, id: 34 },
        { name: "10000'lik", code: 'HR-L', value: 10000, id: 33 },
        { name: "2500'lük", code: 'HR-M', value: 2500, id: 32 },
        { name: "500'lük", code: 'HR-S', value: 500, id: 31 },
      ],
      id: 9,
    },
  ],
}

const chips = ref(
  apiResponse.data.map((group) => ({
    ...group,
    denominations: group.denominations.map((d) => ({
      ...d,
      quantity: 0,
    })),
  })),
)

const onUpdate = (denom, value) => {
  denom.quantity = Math.max(0, +value || 0)
}

const getGroupTotal = (group) => {
  return group.denominations.reduce((acc, d) => acc + d.quantity * d.value, 0)
}

const getGroupQuantity = (group) => {
  return group.denominations.reduce((acc, d) => acc + d.quantity, 0)
}

const currencyTotals = computed(() => {
  const map = new Map()
  chips.value.forEach((group) => {
    const total = getGroupTotal(group)
    const qty = getGroupQuantity(group)
    if (!map.has(group.currencyName)) {
      map.set(group.currencyName, { currency: group.currencyName, total: 0, quantity: 0 })
    }
    const entry = map.get(group.currencyName)
    entry.total += total
    entry.quantity += qty
  })
  return Array.from(map.values())
})

const totalChipsCount = computed(() =>
  chips.value.reduce((acc, g) => acc + getGroupQuantity(g), 0),
)

const resetGroup = (group) => {
  group.denominations.forEach((d) => {
    d.quantity = 0
  })
}
</script>

<template>
  <div class="chip-grid-page">
    <Fieldset legend="Chip Count" class="chip-fieldset">
      <div class="chips-grid">
      <div
        v-for="group in chips"
        :key="group.id"
        class="chip-card"
        :class="{ 'chip-card--active': getGroupTotal(group) > 0 }"
        :style="{ '--accent': group.color }"
      >
        <div class="chip-card__header">
          <div class="chip-card__title-wrap">
            <span class="chip-card__color" :style="{ background: group.color }"></span>
            <div class="chip-card__title">
              <span class="chip-card__name">{{ group.name }}</span>
              <span class="chip-card__currency">{{ group.currencyName }}</span>
            </div>
          </div>
          <button
            v-if="getGroupTotal(group) > 0"
            class="chip-card__clear"
            title="Clear this group"
            @click="resetGroup(group)"
          >
            <q-icon name="close" size="12px" />
          </button>
        </div>

        <div class="chip-card__body">
          <div class="denom-head">
            <div>Denom</div>
            <div>Qty</div>
            <div>Total</div>
          </div>

          <div
            v-for="denom in group.denominations"
            :key="denom.id"
            class="denom-row"
            :class="{ 'denom-row--filled': denom.quantity > 0 }"
          >
            <div class="denom-info">
              <span class="denom-code">{{ (denom.code || '').trim() || '—' }}</span>
              <span class="denom-value">{{ formatPrice(denom.value) }}</span>
            </div>

            <div class="denom-qty">
              <div class="qty-stepper">
                <button
                  type="button"
                  class="qty-stepper__btn"
                  :disabled="denom.quantity <= 0"
                  @click="onUpdate(denom, denom.quantity - 1)"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  class="qty-stepper__input"
                  :value="denom.quantity"
                  @input="(e) => onUpdate(denom, e.target.value)"
                  @focus="(e) => e.target.select()"
                  placeholder="0"
                />
                <button
                  type="button"
                  class="qty-stepper__btn"
                  @click="onUpdate(denom, denom.quantity + 1)"
                >
                  +
                </button>
              </div>
            </div>

            <div class="denom-total" :class="{ 'denom-total--active': denom.quantity > 0 }">
              {{ formatPrice(denom.quantity * denom.value) }}
            </div>
          </div>
        </div>

        <div class="chip-card__footer">
          <span class="footer-label">
            {{ getGroupQuantity(group) }} pcs
          </span>
          <span class="footer-total">
            {{ formatPrice(getGroupTotal(group)) }}
            <span class="footer-currency">{{ group.currencyName }}</span>
          </span>
        </div>
      </div>
    </div>

      <div class="totals-bar">
        <div class="totals-bar__meta">
          <span class="totals-bar__icon">
            <q-icon name="functions" size="16px" />
          </span>
          <div class="totals-bar__meta-text">
            <span class="totals-bar__label">Grand Total</span>
            <span class="totals-bar__sub">{{ totalChipsCount }} chips across all cards</span>
          </div>
        </div>
        <div class="totals-bar__amounts">
          <div
            v-for="row in currencyTotals"
            :key="row.currency"
            class="totals-bar__amount"
            :class="{ 'totals-bar__amount--empty': row.total === 0 }"
          >
            <span class="totals-bar__amount-currency">{{ row.currency }}</span>
            <span class="totals-bar__amount-value">{{ formatPrice(row.total) }}</span>
          </div>
        </div>
      </div>
    </Fieldset>
  </div>
</template>

<style scoped lang="scss">
.chip-grid-page {
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0f172a;
}

.chip-fieldset {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  :deep(.p-fieldset-legend) {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: 0.02em;
  }

  :deep(.p-fieldset-content) {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

 

.chips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 10px;
}

.chip-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent, #0f172a);
    opacity: 0.5;
    transition: opacity 0.15s ease;
  }

  &:hover {
    border-color: #d1d5db;
  }

  &--active {
    border-color: var(--accent, #0f172a);

    &::before {
      opacity: 1;
    }
  }
}

.chip-card__header {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  min-height: 44px;
}

.chip-card__title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip-card__color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.chip-card__title {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.chip-card__name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.chip-card__currency {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.chip-card__clear {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
}

.chip-card__body {
  padding: 6px 10px 8px;
  flex: 1;
}

.denom-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px minmax(72px, auto);
  gap: 10px;
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  > div:nth-child(2) {
    text-align: center;
  }

  > div:nth-child(3) {
    text-align: right;
  }
}

.denom-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px minmax(72px, auto);
  gap: 10px;
  padding: 5px 8px;
  align-items: center;
  border-radius: 6px;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
  }

  &--filled {
    background: color-mix(in srgb, var(--accent, #0f172a) 4%, white);
  }
}

.denom-info {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: nowrap;
}

.denom-code {
  flex: 0 0 auto;
  font-size: 9px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 5px;
  border-radius: 3px;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.denom-value {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.denom-qty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.qty-stepper {
  display: inline-flex;
  align-items: stretch;
  height: 28px;
  width: 100%;
  max-width: 108px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus-within {
    border-color: var(--accent, #0f172a);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #0f172a) 12%, transparent);
  }
}

.qty-stepper__btn {
  flex: 0 0 24px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--accent, #0f172a) 8%, transparent);
    color: var(--accent, #0f172a);
  }

  &:active:not(:disabled) {
    background: color-mix(in srgb, var(--accent, #0f172a) 14%, transparent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.qty-stepper__input {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 400;
  }
}

.denom-total {
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  color: #cbd5e1;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: color 0.15s ease;

  &--active {
    color: #0f172a;
    font-weight: 600;
  }
}

.chip-card__footer {
  padding: 10px 14px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.footer-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.footer-total {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
}

.footer-currency {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

.totals-bar {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  position: relative;
}

.totals-bar__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.totals-bar__icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.totals-bar__meta-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.totals-bar__label {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.totals-bar__sub {
  font-size: 12px;
  color: #94a3b8;
}

.totals-bar__amounts {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.totals-bar__amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  min-width: 96px;
  transition: opacity 0.15s ease, border-color 0.15s ease;

  &--empty {
    opacity: 0.5;
  }
}

.totals-bar__amount-currency {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.totals-bar__amount-value {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .chip-grid-page {
    padding: 14px;
  }

  .chips-grid {
    grid-template-columns: 1fr;
  }

  .totals-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .totals-bar__amounts {
    width: 100%;
    justify-content: flex-start;
  }

  .totals-bar__amount {
    align-items: flex-start;
  }
}
</style>
