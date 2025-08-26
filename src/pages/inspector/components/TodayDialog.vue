<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="" square style="min-width: 800px; min-height: 600px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="row">
          <div class="col-12 flex">
            <div class="text-subtitle1 text-bold flex content-end items-center">
              <q-icon name="o_info" size="sm" />
              {{ $t('todaysCustomers') }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          class="full-width"
          content="Bugünün müşterilerini buradan görüntüleyebilirsiniz."
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row">
          <div class="col-4 q-pa-sm">
            <q-list bordered separator>
              <q-scroll-area style="height: 478px">
                <q-item
                  v-for="(table, index) in tables"
                  :key="index"
                  clickable
                  v-ripple
                  dense
                  @click="onClickTable(table)"
                  :class="{ 'bg-red-1': currentTable?.id === table.id }"
                >
                  <q-item-section>
                    <q-item-label class="text-bold text-negative">{{ table.name }}</q-item-label>
                    <q-item-label caption lines="1">{{
                      table.gameName + ' (' + table.floatSetName + ')'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-scroll-area>
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="13px"
                icon="o_people"
                class="full-width"
                :label="$t('allPlayers')"
                @click="onClickAllPlayers"
              />
            </q-list>
          </div>
          <div class="col-8 q-pa-sm">
            <q-markup-table dense separator="cell" flat square bordered class="full-height">
              <thead>
                <tr>
                  <th class="text-center">Player Id</th>
                  <th class="text-center">Player Full Name</th>
                  <th class="text-center">Image</th>
                  <th class="text-center">Time In</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(customer, index) in currentTableCustomers"
                  :key="index"
                  class="full-width"
                >
                  <td class="text-center">{{ customer.playerId }}</td>
                  <td class="text-center">{{ customer.playerFullName }}</td>
                  <td class="text-center">
                    <q-img
                      :src="customerImagePath + customer.playerId"
                      style="width: 50px; height: 50px"
                      :img-style="{ borderRadius: '3px' }"
                      error-src="/assets/no-photo.png"
                      @click="onClickPlayerPhoto(customer)"
                    />
                  </td>
                  <td class="text-center">
                    <q-btn
                      color="grey-2"
                      unelevated
                      class="q-mr-sm"
                      text-color="dark"
                      no-wrap
                      no-caps
                      @click="onClickTimeIn(customer)"
                    >
                      <q-img
                        src="/inspectors/icons8-time-machine-40.png"
                        width="25px"
                        class="q-mr-xs"
                      />
                      <div>{{ $t('timeIn') }}</div>
                    </q-btn>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showPlayerPhotoDialog" transition-show="slide-up" transition-hide="slide-down">
    <q-card square style="min-width: 300px">
      <q-card-section class="q-pa-none">
        <q-img
          class="q-pa-xs"
          :src="customerImagePath + currentPlayer.playerId"
          style="width: 300px; height: 300px"
          :img-style="{ borderRadius: '3px' }"
          error-src="/assets/no-photo.png"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useInspectorStore } from 'src/stores/inspector-store'
const inspectorStore = useInspectorStore()

const customerImagePath = process.env.API_URL + ':5050/api/Player/GetPhotoAsJpeg?id='
const props = defineProps({
  tables: {
    type: Array,
    required: true,
  },
  timeInFn: {
    type: Function,
    required: true,
  },
  currentTableId: {
    type: Number,
    required: true,
  },
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

onMounted(async () => {})
const currentTableCustomers = ref([])
const currentTable = ref(null)
const showPlayerPhotoDialog = ref(false)
const currentPlayer = ref(null)
const onClickTable = async (table) => {
  currentTable.value = table
  await inspectorStore.playerSitTodayHistory({ tableId: table.id }).then((res) => {
    currentTableCustomers.value = res
  })
}
const onClickPlayerPhoto = (player) => {
  currentPlayer.value = player
  showPlayerPhotoDialog.value = true
}
const onClickTimeIn = async (player) => {
  if (props.currentTableId) {
    await props
      .timeInFn({
        playerId: player.playerId,
        tableId: props.currentTableId,
      })
      .then(() => {
        onDialogOK({})
      })
  }
}
const onClickAllPlayers = async () => {
  await inspectorStore.playerSitTodayHistory().then((res) => {
    currentTableCustomers.value = res
  })
}
</script>
<style scoped lang="scss">
.appendAmount {
  margin-right: -5px;
  min-width: 100px;
  border-left: 1px solid #dddddd;
}

fieldset {
  border: 1px solid rgb(0 0 0 / 12%);
  border-radius: 3px;
  padding: 10px;
  //margin: 10px;
}

.player-photo-container {
  display: inline-block;
}

.player-photo {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.player-photo:hover {
  transform: scale(3) translate(30px, 30px);
  z-index: 9999;
  position: relative;
}
</style>
