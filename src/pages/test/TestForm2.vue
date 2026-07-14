<template>
  <div class="tf2-container">
    <q-card flat class="tf2-card">
      <div class="tf2-card__header">
        <div>
          <h2 class="tf2-card__title">Dynamic Stream Entry</h2>
          <p class="tf2-card__subtitle">
            Master bilgileri doldurun, ardından isteğe bağlı alt işlemler ekleyin. Alt düğüm olmadan da kayıt yapılabilir.
          </p>
        </div>
        <q-icon name="account_tree" size="30px" class="tf2-card__header-icon" />
      </div>

      <q-form ref="formRef" @submit.prevent="handleSave">
        <section class="tf2-section" aria-labelledby="tf2-master-heading">
          <h3 id="tf2-master-heading" class="tf2-section__label">
            <span class="tf2-section__step">1</span>
            Master Specifications
          </h3>

          <div class="tf2-master-grid">
            <q-input
              v-model="masterForm.master_reference_no"
              outlined
              label="Master Referans No"
              :rules="[requiredRule]"
              aria-label="Master referans numarası"
              class="super-small"
              dense
              type="text"
            />

            <q-input
              v-model="masterForm.global_date_time"
              outlined
              label="Global Tarih / Saat"
              type="datetime-local"
              stack-label
              :rules="[requiredRule]"
              aria-label="Global tarih ve saat"
              dense
            />

            <q-select
              v-model="masterForm.department"
              outlined
              label="Departman"
              :options="departmentOptions"
              :rules="[requiredRule]"
              aria-label="Departman"
              dense
            />

            <q-select
              v-model="masterForm.priority"
              outlined
              label="Öncelik"
              :options="priorityOptions"
              :rules="[requiredRule]"
              aria-label="Öncelik"
              dense
            />

            <q-input
              v-model="masterForm.operator"
              outlined
              label="Operatör"
              :rules="[requiredRule]"
              aria-label="Operatör"
              dense
            />

            <q-input
              v-model="masterForm.notes"
              outlined
              label="Notlar"
              type="textarea"
              autogrow
              class="tf2-field-full"
              aria-label="Notlar"
              dense
            />
          </div>
        </section>

        <section class="tf2-section" aria-labelledby="tf2-nodes-heading">
          <h3 id="tf2-nodes-heading" class="tf2-section__label">
            <span class="tf2-section__step">2</span>
            Sub Transactions
            <span v-if="nodes.length" class="text-weight-regular text-grey-6">({{ nodes.length }})</span>
          </h3>

          <div v-if="!nodes.length" class="tf2-empty">
            <q-icon name="info_outline" size="20px" />
            <span>Henüz alt işlem eklenmedi — yalnızca master verisiyle kayıt yapabilirsiniz.</span>
          </div>

          <transition-group name="tf2-node" tag="div" class="tf2-stream">
            <div
              v-for="node in nodes"
              :key="node.id"
              class="tf2-node"
              :class="{ 'is-collapsed': node.collapsed }"
              :style="typeColorStyle(node.type.color)"
            >
              <div
                class="tf2-node__header"
                role="button"
                tabindex="0"
                :aria-expanded="!node.collapsed"
                :aria-label="`${node.type.label} düğümünü ${node.collapsed ? 'genişlet' : 'daralt'}`"
                @click="handleToggleCollapse(node.id)"
                @keydown.enter.prevent="handleToggleCollapse(node.id)"
                @keydown.space.prevent="handleToggleCollapse(node.id)"
              >
                <span class="tf2-node__icon">
                  <q-icon :name="node.type.icon" size="18px" />
                </span>

                <span class="tf2-node__meta">
                  <span class="tf2-node__title">{{ node.type.label }} #{{ node.nodeId }}</span>
                  <span class="tf2-node__summary">{{ nodeSummary(node) }}</span>
                </span>

                <span class="tf2-node__actions" @click.stop>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete_outline"
                    size="sm"
                    class="tf2-node__delete"
                    :aria-label="`${node.type.label} düğümünü sil`"
                    @click="handleRemoveNode(node.id)"
                  />
                  <q-icon
                    name="expand_more"
                    size="20px"
                    class="tf2-node__chevron"
                    :class="{ 'is-open': !node.collapsed }"
                  />
                </span>
              </div>

              <div v-show="!node.collapsed" class="tf2-node__body">
                <div class="tf2-node__grid">
                  <q-input
                    v-model.number="node.form.amount"
                    outlined
                    label="Tutar"
                    type="number"
                    min="0"
                    step="0.01"
                    :suffix="node.form.currency"
                    :rules="[requiredRule, positiveRule]"
                    :aria-label="`${node.type.label} tutar`"
                    class="tf2-node__field super-small"
                    dense
                  >
                    <template #prepend>
                      <q-icon name="payments" />
                    </template>
                  </q-input>

                  <q-select
                    v-model="node.form.currency"
                    outlined
                    label="Para Birimi"
                    :options="currencyOptions"
                    :rules="[requiredRule]"
                    :aria-label="`${node.type.label} para birimi`"
                    class="tf2-node__field"
                    dense
                  />

                  <template v-for="(field, index) in node.type.fields" :key="field.key">
                    <q-select
                      v-if="field.type === 'select'"
                      v-model="node.form[field.key]"
                      outlined
                      :label="field.label"
                      :options="field.options"
                      :rules="[requiredRule]"
                      :aria-label="field.label"
                      class="tf2-node__field"
                      :style="{ animationDelay: `${index * 50}ms` }"
                      dense
                    />

                    <q-input
                      v-else
                      v-model="node.form[field.key]"
                      outlined
                      :label="field.label"
                      :type="field.type === 'number' ? 'number' : 'text'"
                      :min="field.type === 'number' ? 0 : undefined"
                      :rules="field.type === 'number' ? [requiredRule, positiveRule] : [requiredRule]"
                      :aria-label="field.label"
                      class="tf2-node__field"
                      :style="{ animationDelay: `${index * 50}ms` }"
                      dense
                    />
                  </template>
                </div>
              </div>
            </div>
          </transition-group>

          <div class="tf2-action-bar" role="toolbar" aria-label="Alt işlem ekle">
            <span class="tf2-action-bar__label">Ekle:</span>
            <button
              v-for="type in nodeTypes"
              :key="type.id"
              type="button"
              class="tf2-action-bar__btn"
              :style="typeColorStyle(type.color)"
              :aria-label="`${type.label} ekle`"
              @click="handleAddNode(type)"
            >
              <q-icon :name="type.icon" size="16px" />
              {{ type.label }}
              <span class="tf2-action-bar__kbd">{{ type.shortcut }}</span>
            </button>
          </div>
        </section>

        <div class="tf2-footer">
          <p class="tf2-hint">
            Kayıt, master verisini her zaman gönderir. Alt düğümler opsiyoneldir ve bağımsız validasyona sahiptir.
          </p>

          <q-btn
            type="submit"
            unelevated
            no-caps
            class="tf2-save"
            label="Kaydet"
            icon="save"
            aria-label="Formu kaydet"
          />

          <pre v-if="lastPayload" class="tf2-payload" aria-label="Son gönderilen payload">{{ lastPayload }}</pre>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const currencyOptions = ['TRY', 'USD', 'EUR', 'GBP']
const departmentOptions = ['Cage Operations', 'Finance', 'VIP Services', 'Audit']
const priorityOptions = ['Normal', 'Yüksek', 'Acil']

const nodeTypes = [
  {
    id: 'cage',
    label: 'Cage',
    icon: 'account_balance',
    color: '#3b82f6',
    shortcut: '1',
    fields: [
      { key: 'cage_code', label: 'Cage Kodu', type: 'select', options: ['MAIN-CAGE', 'VIP-CAGE', 'SIDE-CAGE'] },
      { key: 'officer', label: 'Görevli', type: 'text' },
      { key: 'shift', label: 'Vardiya', type: 'select', options: ['Sabah', 'Akşam', 'Gece'] },
      { key: 'direction', label: 'İşlem Yönü', type: 'select', options: ['Fill', 'Credit', 'Transfer'] },
    ],
  },
  {
    id: 'chip',
    label: 'Chip',
    icon: 'casino',
    color: '#f59e0b',
    shortcut: '2',
    fields: [
      { key: 'chip_set', label: 'Chip Seti', type: 'select', options: ['Standart', 'VIP', 'Turnuva'] },
      { key: 'denomination', label: 'Denominasyon', type: 'select', options: ['5', '25', '100', '500', '1000'] },
      { key: 'quantity', label: 'Adet', type: 'number' },
      { key: 'table_no', label: 'Masa No', type: 'text' },
    ],
  },
  {
    id: 'petty',
    label: 'Petty Cash',
    icon: 'request_quote',
    color: '#10b981',
    shortcut: '3',
    fields: [
      { key: 'category', label: 'Kategori', type: 'select', options: ['Office Supplies', 'Refreshment', 'Maintenance', 'Transport'] },
      { key: 'invoice_ref', label: 'Fatura Ref', type: 'text' },
      { key: 'requested_by', label: 'Talep Eden', type: 'text' },
      { key: 'approval_status', label: 'Onay Durumu', type: 'select', options: ['Bekliyor', 'Onaylandı', 'Reddedildi'] },
    ],
  },
  {
    id: 'player',
    label: 'Player',
    icon: 'person',
    color: '#8b5cf6',
    shortcut: '4',
    fields: [
      { key: 'player_id', label: 'Player ID', type: 'text' },
      { key: 'account_type', label: 'Hesap Tipi', type: 'select', options: ['Front Money', 'Safe Keeping', 'Credit Line'] },
      { key: 'transaction_type', label: 'İşlem Tipi', type: 'select', options: ['Deposit', 'Withdraw', 'Marker'] },
      { key: 'note', label: 'Not', type: 'text' },
    ],
  },
]

const toLocalDateTimeInput = (date) => {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const createMasterDefaults = () => ({
  master_reference_no: `MSTR-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
  global_date_time: toLocalDateTimeInput(new Date()),
  department: null,
  priority: 'Normal',
  operator: '',
  notes: '',
})

const formRef = ref(null)
const nodeCounter = ref(0)
const nodes = ref([])
const lastPayload = ref('')
const masterForm = reactive(createMasterDefaults())

const requiredRule = (val) => (val !== null && val !== undefined && val !== '') || 'Zorunlu alan'
const positiveRule = (val) => Number(val) > 0 || 'Sıfırdan büyük olmalı'

const typeColorStyle = (color) => ({ '--tf2-type-color': color })

const formatAmount = (amount) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount)

const createNodeForm = (type) => {
  const form = { amount: null, currency: 'TRY' }
  type.fields.forEach((field) => {
    form[field.key] = field.type === 'number' ? null : ''
  })
  return form
}

const handleAddNode = (type) => {
  nodeCounter.value += 1

  nodes.value.push({
    id: `${type.id}-${Date.now()}`,
    nodeId: nodeCounter.value,
    type,
    collapsed: false,
    form: createNodeForm(type),
  })
}

const handleRemoveNode = (id) => {
  nodes.value = nodes.value.filter((node) => node.id !== id)
}

const handleToggleCollapse = (id) => {
  const node = nodes.value.find((item) => item.id === id)
  if (node) node.collapsed = !node.collapsed
}

const nodeSummary = (node) => {
  const amount = node.form.amount ? `${formatAmount(node.form.amount)} ${node.form.currency}` : 'Tutar girilmedi'
  const firstField = node.type.fields.find((field) => node.form[field.key])
  const detail = firstField ? `${firstField.label}: ${node.form[firstField.key]}` : 'Detay bekleniyor'
  return `${amount} · ${detail}`
}

const buildPayload = () => {
  const payload = {
    master_reference_no: masterForm.master_reference_no,
    global_date_time: masterForm.global_date_time,
    department: masterForm.department,
    priority: masterForm.priority,
    operator: masterForm.operator,
    notes: masterForm.notes,
    sub_transactions: nodes.value.map((node) => ({
      node_id: node.nodeId,
      type: node.type.id,
      amount: Number(node.form.amount),
      currency: node.form.currency,
      ...node.type.fields.reduce((acc, field) => {
        acc[field.key] = node.form[field.key]
        return acc
      }, {}),
    })),
  }

  return payload
}

const handleSave = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  const payload = buildPayload()
  lastPayload.value = JSON.stringify(payload, null, 2)

  const nodeCount = payload.sub_transactions.length
  const caption = nodeCount
    ? `${nodeCount} alt işlem ile kaydedildi`
    : 'Yalnızca master verisi kaydedildi'

  $q.notify({
    type: 'positive',
    message: 'Payload hazır',
    caption,
    position: 'top-right',
    timeout: 3000,
  })

  console.info('[TestForm2] API Payload:', payload)
}

const handleKeyboardShortcut = (event) => {
  if (!event.altKey) return
  const type = nodeTypes.find((item) => item.shortcut === event.key)
  if (type) {
    event.preventDefault()
    handleAddNode(type)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
})
</script>

<style lang="scss">
@import 'src/css/assets/_testform2.scss';
</style>
