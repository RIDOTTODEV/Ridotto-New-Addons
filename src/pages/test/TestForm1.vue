<template>
 <div class="test-form-container">
        <q-card flat class="tf-card">
          <div class="tf-card__header">
            <div>
              <h2 class="tf-card__title">Yeni Transaction</h2>
              <p class="tf-card__subtitle">Ortak bilgileri doldurun, ardından bir veya birden fazla transaction tipi ekleyin</p>
            </div>
            <q-icon name="receipt_long" size="30px" class="tf-card__header-icon" />
          </div>
  
          <transition name="tf-slot">
            <div v-if="lastTransaction" class="tf-summary">
              <button
                type="button"
                class="tf-summary__main"
                :aria-expanded="isHistoryOpen"
                aria-label="Son işlem geçmişini aç/kapat"
                @click="handleToggleHistory"
              >
                <span :key="lastTransaction.id" class="tf-summary__badges">
                  <span
                    v-for="section in lastTransaction.sections"
                    :key="section.typeId"
                    class="tf-summary__badge"
                    :style="typeColorStyle(section.color)"
                  >
                    <q-icon :name="section.icon" size="15px" />
                    {{ section.label }}
                  </span>
                </span>
                <span class="tf-summary__text">
                  Son işlem:
                  <strong>{{ formatAmount(lastTransaction.amount) }} {{ lastTransaction.currency }}</strong>
                  <span class="tf-summary__time">• {{ lastTransaction.time }}</span>
                </span>
                <q-icon
                  name="expand_more"
                  size="20px"
                  class="tf-summary__chevron"
                  :class="{ 'is-open': isHistoryOpen }"
                />
              </button>
  
              <transition name="tf-slot">
                <ul v-if="isHistoryOpen" class="tf-summary__history">
                  <li v-for="item in recentTransactions" :key="item.id" class="tf-summary__history-item">
                    <span class="tf-summary__dots">
                      <span
                        v-for="section in item.sections"
                        :key="section.typeId"
                        class="tf-summary__dot"
                        :style="typeColorStyle(section.color)"
                      />
                    </span>
                    <span class="tf-summary__history-type">{{ historyTypeLabel(item) }}</span>
                    <span class="tf-summary__history-detail">{{ item.details }}</span>
                    <span class="tf-summary__history-amount">
                      {{ formatAmount(item.amount) }} {{ item.currency }}
                    </span>
                    <span class="tf-summary__history-time">{{ item.time }}</span>
                  </li>
                </ul>
              </transition>
            </div>
          </transition>
  
          <q-form ref="formRef" class="tf-form" @submit.prevent="handleSave">
            <div class="tf-form__grid">
              <q-input
                v-model.number="commonForm.amount"
                outlined
                label="Tutar"
                type="number"
                min="0"
                step="0.01"
                :suffix="commonForm.currency"
                :rules="[requiredRule, positiveRule]"
                aria-label="Tutar"
                class="super-small"
              >
                <template #prepend>
                  <q-icon name="payments" />
                </template>
              </q-input>
  
              <q-select
                v-model="commonForm.currency"
                outlined
                label="Para Birimi"
                :options="currencyOptions"
                :rules="[requiredRule]"
                aria-label="Para birimi"
              />
  
              <q-input
                v-model="commonForm.dateTime"
                outlined
                label="Tarih / Saat"
                type="datetime-local"
                stack-label
                :rules="[requiredRule]"
                aria-label="Tarih ve saat"
              />
  
              <q-select
                v-model="commonForm.paymentMethod"
                outlined
                label="Ödeme Yöntemi"
                :options="paymentMethodOptions"
                :rules="[requiredRule]"
                aria-label="Ödeme yöntemi"
              />
  
              <q-input
                v-model="commonForm.referenceNo"
                outlined
                label="Referans No"
                aria-label="Referans numarası"
              />
  
              <q-input
                v-model="commonForm.description"
                outlined
                label="Açıklama"
                type="textarea"
                autogrow
                class="tf-form__full"
                aria-label="Açıklama"
              />
            </div>
  
            <div class="tf-slot-area">
              <transition-group name="tf-slot" tag="div" class="tf-sections">
                <div
                  v-for="section in addedSections"
                  :key="section.uid"
                  class="tf-subcard"
                  :style="typeColorStyle(section.type.color)"
                >
                  <div class="tf-subcard__strip">
                    <q-icon :name="section.type.icon" size="20px" />
                    <span class="tf-subcard__strip-title">{{ section.type.label }}</span>
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      size="sm"
                      class="tf-subcard__remove"
                      :aria-label="`${section.type.label} bölümünü kaldır`"
                      @click="handleRemoveSection(section.uid)"
                    />
                  </div>
  
                  <div class="tf-subcard__grid">
                    <div
                      v-for="(field, index) in section.type.fields"
                      :key="field.key"
                      class="tf-subcard__field"
                      :style="{ animationDelay: `${index * 50}ms` }"
                    >
                      <q-select
                        v-if="field.type === 'select'"
                        v-model="section.form[field.key]"
                        outlined
                        :label="field.label"
                        :options="field.options"
                        :rules="[requiredRule]"
                        :aria-label="field.label"
                      />
  
                      <div v-else-if="field.type === 'toggle'" class="tf-subcard__toggle">
                        <span class="tf-subcard__toggle-label">{{ field.label }}</span>
                        <q-btn-toggle
                          v-model="section.form[field.key]"
                          no-caps
                          unelevated
                          toggle-color="primary"
                          :options="field.options"
                          :aria-label="field.label"
                        />
                      </div>
  
                      <q-input
                        v-else
                        v-model="section.form[field.key]"
                        outlined
                        :label="field.label"
                        :type="field.type === 'number' ? 'number' : 'text'"
                        :min="field.type === 'number' ? 0 : undefined"
                        :rules="field.type === 'number' ? [requiredRule, positiveRule] : [requiredRule]"
                        :aria-label="field.label"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
  
              <transition name="tf-slot" mode="out-in">
                <button
                  v-if="!isPicking"
                  key="idle"
                  type="button"
                  class="tf-add"
                  :disabled="isAllTypesAdded"
                  aria-label="Transaction ekle"
                  @click="handleOpenPicker"
                >
                  <q-icon name="add_circle_outline" size="22px" />
                  <span>{{ addedSections.length ? 'Başka Transaction Ekle' : 'Transaction Ekle' }}</span>
                </button>
  
                <div v-else key="picking" class="tf-picker">
                  <div class="tf-picker__header">
                    <span class="tf-picker__header-title">Transaction tipi seçin</span>
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      size="sm"
                      aria-label="Tip seçimini kapat"
                      @click="handleClosePicker"
                    />
                  </div>
                  <div class="tf-picker__grid">
                    <button
                      v-for="(type, index) in transactionTypes"
                      :key="type.id"
                      type="button"
                      class="tf-picker__item"
                      :class="{ 'is-added': isTypeAdded(type.id) }"
                      :disabled="isTypeAdded(type.id)"
                      :style="{ ...typeColorStyle(type.color), animationDelay: `${index * 50}ms` }"
                      :aria-label="isTypeAdded(type.id) ? `${type.label} zaten eklendi` : `${type.label} seç`"
                      @click="handleSelectType(type)"
                    >
                      <span class="tf-picker__icon">
                        <q-icon :name="isTypeAdded(type.id) ? 'check' : type.icon" size="22px" />
                      </span>
                      <span class="tf-picker__label">{{ type.label }}</span>
                      <span v-if="isTypeAdded(type.id)" class="tf-picker__added">Eklendi</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
  
            <q-btn
              type="submit"
              unelevated
              no-caps
              class="tf-save"
              label="Kaydet"
              icon="save"
              :disable="!canSave"
              aria-label="Transaction kaydet"
            />
          </q-form>
        </q-card>
      </div>
  </template>
  
  <script setup>
  import { computed, reactive, ref } from 'vue'
  import { useQuasar } from 'quasar'
  
  const $q = useQuasar()
  
  const currencyOptions = ['TRY', 'USD', 'EUR', 'GBP']
  const paymentMethodOptions = ['Nakit', 'Kredi Kartı', 'Banka Transferi', 'Çek']
  
  const transactionTypes = [
    {
      id: 'cage',
      label: 'Cage Transaction',
      icon: 'account_balance',
      color: '#3b82f6',
      fields: [
        { key: 'cage', label: 'Cage', type: 'select', options: ['Main Cage', 'Cage 2', 'VIP Cage'] },
        {
          key: 'direction',
          label: 'İşlem Yönü',
          type: 'toggle',
          options: [
            { label: 'Fill', value: 'Fill' },
            { label: 'Credit', value: 'Credit' },
          ],
        },
        { key: 'approvedBy', label: 'Onaylayan', type: 'text' },
        { key: 'shift', label: 'Vardiya', type: 'select', options: ['Sabah', 'Akşam', 'Gece'] },
      ],
    },
    {
      id: 'chip',
      label: 'Chip Transaction',
      icon: 'casino',
      color: '#f59e0b',
      fields: [
        { key: 'chipSet', label: 'Chip Seti', type: 'select', options: ['Standart Set', 'VIP Set', 'Turnuva Set'] },
        { key: 'denomination', label: 'Denominasyon', type: 'select', options: ['5', '25', '100', '500', '1000'] },
        { key: 'quantity', label: 'Adet', type: 'number' },
        { key: 'tableNo', label: 'Masa No', type: 'text' },
      ],
    },
    {
      id: 'pettyCash',
      label: 'Petty Cash',
      icon: 'request_quote',
      color: '#10b981',
      fields: [
        { key: 'category', label: 'Kategori', type: 'select', options: ['Ofis', 'İkram', 'Bakım', 'Ulaşım', 'Diğer'] },
        { key: 'voucherNo', label: 'Fiş No', type: 'text' },
        { key: 'requestedBy', label: 'Talep Eden', type: 'text' },
        { key: 'approvalStatus', label: 'Onay Durumu', type: 'select', options: ['Bekliyor', 'Onaylandı', 'Reddedildi'] },
      ],
    },
    {
      id: 'player',
      label: 'Player Transaction',
      icon: 'person',
      color: '#8b5cf6',
      fields: [
        { key: 'player', label: 'Player', type: 'select', options: ['Ahmet Yılmaz', 'Mehmet Demir', 'John Smith', 'Maria Rossi'] },
        {
          key: 'direction',
          label: 'İşlem Tipi',
          type: 'toggle',
          options: [
            { label: 'Deposit', value: 'Deposit' },
            { label: 'Withdraw', value: 'Withdraw' },
          ],
        },
        { key: 'accountType', label: 'Hesap Tipi', type: 'select', options: ['Front Money', 'Safe Keeping', 'Credit Line'] },
        { key: 'note', label: 'Not', type: 'text' },
      ],
    },
  ]
  
  const toLocalDateTimeInput = (date) => {
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  
  const createCommonFormDefaults = () => ({
    amount: null,
    currency: 'TRY',
    dateTime: toLocalDateTimeInput(new Date()),
    paymentMethod: null,
    referenceNo: '',
    description: '',
  })
  
  const formRef = ref(null)
  const isPicking = ref(false)
  const isHistoryOpen = ref(false)
  const commonForm = reactive(createCommonFormDefaults())
  const addedSections = ref([])
  const savedTransactions = ref([])
  
  const requiredRule = (val) => (val !== null && val !== undefined && val !== '') || 'Zorunlu alan'
  const positiveRule = (val) => Number(val) > 0 || 'Sıfırdan büyük olmalı'
  
  const lastTransaction = computed(() => savedTransactions.value[0] ?? null)
  const recentTransactions = computed(() => savedTransactions.value.slice(0, 3))
  const canSave = computed(() => addedSections.value.length > 0 && Number(commonForm.amount) > 0)
  const isAllTypesAdded = computed(() => addedSections.value.length >= transactionTypes.length)
  
  const typeColorStyle = (color) => ({ '--tf-type-color': color })
  
  const formatAmount = (amount) =>
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount)
  
  const isTypeAdded = (typeId) => addedSections.value.some((section) => section.type.id === typeId)
  
  const handleOpenPicker = () => {
    isPicking.value = true
  }
  
  const handleClosePicker = () => {
    isPicking.value = false
  }
  
  const handleSelectType = (type) => {
    if (isTypeAdded(type.id)) return
  
    const form = {}
    type.fields.forEach((field) => {
      form[field.key] = field.type === 'toggle' ? field.options[0].value : null
    })
  
    addedSections.value.push({
      uid: `${type.id}-${Date.now()}`,
      type,
      form,
    })
    isPicking.value = false
  }
  
  const handleRemoveSection = (uid) => {
    addedSections.value = addedSections.value.filter((section) => section.uid !== uid)
  }
  
  const handleToggleHistory = () => {
    isHistoryOpen.value = !isHistoryOpen.value
  }
  
  const buildSectionDetails = (section) => {
    const filled = section.type.fields
      .map((field) => ({ label: field.label, value: section.form[field.key] }))
      .filter((entry) => entry.value !== null && entry.value !== '')
      .slice(0, 2)
    return filled.map((entry) => `${entry.label}: ${entry.value}`).join(' • ')
  }
  
  const historyTypeLabel = (item) => item.sections.map((section) => section.label).join(' + ')
  
  const handleSave = async () => {
    const isValid = await formRef.value.validate()
    if (!isValid) return
  
    const now = new Date()
    const sections = addedSections.value.map((section) => ({
      typeId: section.type.id,
      label: section.type.label,
      icon: section.type.icon,
      color: section.type.color,
      details: buildSectionDetails(section),
    }))
  
    savedTransactions.value.unshift({
      id: now.getTime(),
      sections,
      amount: commonForm.amount,
      currency: commonForm.currency,
      time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      details: sections.map((section) => section.details).filter(Boolean).join(' | '),
    })
  
    $q.notify({
      type: 'positive',
      message: `${sections.map((section) => section.label).join(' + ')} kaydedildi`,
      caption: `${formatAmount(commonForm.amount)} ${commonForm.currency}`,
      position: 'top-right',
      timeout: 2500,
    })
  
    Object.assign(commonForm, createCommonFormDefaults())
    addedSections.value = []
    isPicking.value = false
    formRef.value.resetValidation()
  }
  </script>
  
  <style lang="scss">
  @import 'src/css/assets/_testform.scss';
  </style>
  