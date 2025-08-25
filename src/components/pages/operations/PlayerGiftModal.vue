<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="full-width" style="max-width: 800px">
      <q-card-section class="row items-center">
        <div class="text-h6">Player Gifts</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div v-if="player" class="q-mb-md">
          <div class="text-subtitle2">
            Giving gift to:
            <span class="text-weight-bold">{{ player.name }} {{ player.surname }}</span>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <!-- Gift Selection -->
          <div class="col-12 col-sm-6">
            <q-select
              v-model="selectedGiftModel"
              outlined
              dense
              label="Gift"
              :options="giftOptions"
              option-value="id"
              option-label="name"
              map-options
              emit-value
              :rules="[(val) => !!val || 'Please select a gift']"
            />
          </div>

          <!-- Date Selection -->
          <div class="col-12 col-sm-6">
            <q-field v-model="formData.plannedDate" label="Planned Date" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formData.plannedDate }}
                </div>
              </template>

              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" />
              </template>

              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.plannedDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-field>
          </div>

          <!-- Given Date Selection -->
          <div class="col-12 col-sm-6">
            <q-field v-model="formData.givenDate" label="Given Date" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ formData.givenDate || 'Not Given' }}
                </div>
              </template>

              <template v-slot:append>
                <q-icon
                  v-if="formData.givenDate"
                  name="clear"
                  class="cursor-pointer"
                  @click.stop.prevent="formData.givenDate = null"
                />
                <q-icon name="event" class="cursor-pointer" />
              </template>

              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="formData.givenDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-field>
          </div>
        </div>
        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn label="New" color="primary" outline @click="resetForm" />
          <q-btn label="Save" color="primary" @click="onSave" :disable="!selectedGiftModel" />
        </div>
      </q-card-section>

      <!-- Player Gifts Table -->
      <q-card-section class="q-pa-md">
        <q-table
          :rows="playerGifts"
          :columns="columns"
          row-key="id"
          dense
          flat
          bordered
          :pagination="{ rowsPerPage: 5 }"
          class="full-width"
          @row-dblclick="(evt, row) => handleEdit(row)"
        >
          <template v-slot:body-cell-giftName="props">
            <q-td :props="props">
              <div class="q-pl-md">{{ props.value }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-plannedDate="props">
            <q-td :props="props">
              <div class="q-pl-md">
                {{ props.value }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-givenDate="props">
            <q-td :props="props">
              <div class="q-pl-md">
                {{ props.value }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="edit" @click="handleEdit(props.row)" />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="handleDelete(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOperationsStore } from 'src/stores/operations-store'
import { useQuasar } from 'quasar'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  player: {
    type: Object,
    default: null,
  },
})

const $q = useQuasar()
const operationsStore = useOperationsStore()

const formData = ref({
  id: 0,
  playerId: null,
  playerFullName: '',
  giftId: null,
  giftName: '',
  plannedDate: new Date().toISOString().split('T')[0],
  givenDate: null,
})

const selectedGiftModel = ref(null)
const giftOptions = ref([])
const playerGifts = ref([])
const isEditing = ref(false)

const columns = ref([])

const fetchGifts = async () => {
  const response = await operationsStore.fetchGiftList()
  if (response && response.data) {
    giftOptions.value = response.data
  }
}

const fetchPlayerGifts = async (playerId) => {
  if (!playerId) {
    playerGifts.value = []
    return
  }
  const giftsResponse = await operationsStore.fetchGiftList({ playerId: playerId })
  playerGifts.value = giftsResponse.data || []
}

const resetForm = () => {
  isEditing.value = false
  selectedGiftModel.value = null
  formData.value = {
    ...formData.value,
    id: null,
    giftId: null,
    giftName: '',
    plannedDate: new Date().toISOString().split('T')[0],
    givenDate: null,
  }
}

const onSave = async () => {
  const gift = giftOptions.value.find((g) => g.id === selectedGiftModel.value)
  if (!gift) return

  const payload = {
    ...formData.value,
    id: formData.value.id || 0, // Ensure id is set for updates
    giftId: gift.id,
    giftName: gift.name,
  }

  let success = false
  if (isEditing.value) {
    success = await operationsStore.updatePlayerGift(payload)
  } else {
    success = await operationsStore.createPlayerGift(payload)
  }

  if (success) {
    await fetchPlayerGifts(formData.value.playerId)
    resetForm()
  }
}

const handleEdit = (row) => {
  isEditing.value = true
  selectedGiftModel.value = row.giftId
  formData.value = {
    id: row.id,
    playerId: row.playerId,
    playerFullName: row.playerFullName,
    giftId: row.giftId,
    giftName: row.giftName,
    plannedDate: String(row.plannedDate).substring(0, 10),
    givenDate: row.givenDate ? String(row.givenDate).substring(0, 10) : null,
  }
}

const handleDelete = async (id) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this gift?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const success = await operationsStore.deletePlayerGift(id)
    if (success) {
      await fetchPlayerGifts(formData.value.playerId)
    }
  })
}

onMounted(() => {
  // 1. Fetch the list of all available gifts for the dropdown
  fetchGifts()

  // 2. Setup the modal for the selected player
  if (props.player?.id) {
    formData.value.playerId = props.player.id
    formData.value.playerFullName = `${props.player.name} ${props.player.surname}`

    // 3. Fetch this player's existing gifts for the table
    fetchPlayerGifts(props.player.id)
  } else {
    // Clear table and player info if no player is provided
    playerGifts.value = []
    formData.value.playerId = null
    formData.value.playerFullName = ''
  }

  // 4. Reset form fields for a new entry, but keep player info
  resetForm()
})
</script>

<style scoped></style>
