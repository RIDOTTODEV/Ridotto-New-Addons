<template>
  <q-card class="no-box-shadow">
    <div class="row app-cart-grey flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="sync_alt"
          size="18px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ $t('guestTransferList') }}
      </div>

      <div class="flex row justify-start items-center no-wrap content-center">
        <q-select
          dense
          class="super-small q-mr-sm"
          v-model="filterFields.hour"
          :options="hourOptions"
          flat
          debounce="1000"
          @update:model-value="fetchGuestTransferList"
          map-options
          option-value="value"
          option-label="label"
          emit-value
          borderless
        />
        <q-icon
          name="cached"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon q-ml-sm"
          color="blue-grey-8"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-list data-cy="playerNotesList" v-if="guestTransferList.length > 0">
        <q-item v-for="(guest, index) in guestTransferList" :key="index" class="q-pa-none">
          <q-item-section class="flex justify-start">
            <q-item-label class="text-caption wrap text-capitalize">
              <span class="text-bold q-mr-sm">{{ guest.playerFullName }}:</span>
              <span>
                {{ date.formatDate(guest.checkIn, 'DD.MM.YYYY HH:mm') }}
              </span>
              <span class="q-mx-sm">-</span>
              <span class="">
                {{ date.formatDate(guest.checkOut, 'DD.MM.YYYY HH:mm') }}
              </span>
            </q-item-label>
            <q-item-label caption class="flex justify-start comment-caption">
              {{ guest.createdByName }} |
              {{ date.formatDate(guest.createdAt, 'DD.MM.YYYY HH:mm') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>
        <div class="bg-grey-1 q-pa-xs q-radius-sm">
          <div class="text-grey text-center">
            <q-icon name="sync_alt" size="24px" />
            <div>No transfer guests found</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
const guestManagementStore = useGuestManagementStore()
const emits = defineEmits(['guestsLength'])
const guestTransferList = ref([])
const filterFields = ref({
  maxResultCount: 5,
  skipCount: 0,
  hour: 6,
})
const fetchGuestTransferList = async () => {
  const data = await guestManagementStore.fetchGuestTransferList({
    ...filterFields.value,
  })
  guestTransferList.value = data || []
  emits('guestsLength', guestTransferList.value.length || 1)
}

onMounted(() => {
  fetchGuestTransferList()
})
const hourOptions = ref([
  {
    label: '6',
    value: 6,
  },
  {
    label: '12',
    value: 12,
  },
  {
    label: '18',
    value: 18,
  },
  {
    label: '24',
    value: 24,
  },
])
</script>

<style scoped></style>
