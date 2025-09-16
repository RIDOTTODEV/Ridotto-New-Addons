<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class=" " square style="min-width: 1200px">
      <q-card-section class="app-cart-grey q-pa-xs flex justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('findCustomer') }}
          <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Information
          class="full-width"
          content="Oyuncu araması için kullanılır ve seçilen oyuncu time in yapılarak masaya oturtulur."
        />
      </q-card-section>
      <q-card-section class="row">
        <div class="col-6 q-pa-xs">
          <div class="row">
            <q-input
              v-model="searchValue"
              outlined
              dense
              :label="$t('searchPlayer')"
              for="id"
              @focus="onInputFocus"
              type="text"
              @keydown.enter="onSubmitForm"
              autofocus
              class="full-width"
              debounce="1000"
              @update:model-value="onSubmitForm"
            >
              <template v-slot:after>
                <q-btn
                  padding="10px"
                  size="xl"
                  class="text-bold full-width"
                  unelevated
                  color="grey"
                  outline
                  @click="onSubmitForm"
                >
                  <q-img src="/inspectors/icons8-binoculars-50.png" style="width: 20px" />
                </q-btn>
              </template>
            </q-input>
          </div>
          <div class="row q-mt-sm">
            <SimpleKeyboard
              :input="searchValue"
              @onChange="onInputChange"
              @onKeyPress="onKeyPress"
              :theme-name="simpleKeyBoardTheme"
            />
          </div>
        </div>
        <div class="col-6 q-pa-xs">
          <q-table
            :rows="playersList"
            :columns="columns"
            row-key="id"
            hide-bottom
            virtual-scroll
            class="full-width"
            separator="cell"
            dense
            bordered
            square
            flat
            :rows-per-page-options="[0]"
            style="height: 456px !important"
            :loading="searchLoading"
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="selectedPlayer?.id === props.row.id ? 'bg-red-2 ' : 'cursor-pointer'"
              >
                <q-td key="id" :props="props" @click="onRowClick(props)">
                  {{ props.row.id }}
                </q-td>

                <q-td key="fullName" :props="props" @click="onRowClick(props)">
                  <div class="text-capitalize">{{ props.row.value }}</div>
                </q-td>
                <q-td key="photo" :props="props" @click="onClickPlayerPhoto(props.row)">
                  <q-img
                    :src="$playerPhotoUrl + props.row.id"
                    fit="cover"
                    error-src="/assets/no-photo.png"
                    style="width: 50px"
                  />
                </q-td>
                <q-td key="timeIn" :props="props">
                  <q-btn
                    color="grey-2"
                    unelevated
                    class="q-mr-sm"
                    text-color="dark"
                    no-wrap
                    no-caps
                    dense
                    @click="onClickTimeIn(props)"
                    :disable="disableTimeIn"
                  >
                    <q-img
                      src="/inspectors/icons8-time-machine-40.png"
                      width="25px"
                      class="q-mr-xs"
                    />
                    <div class="q-ml-md text-negative text-capitalize">
                      <span class="text-dark">{{ $t('timeIn') }}</span>
                    </div>
                    <q-tooltip class="q-card--bordered app-cart-grey text-dark">
                      <Information
                        class="full-width"
                        content="Player’ın masaya oturmak için kullanılır."
                      />
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    color="grey-2"
                    unelevated
                    class="q-mr-sm q-card--bordered"
                    text-color="dark"
                    no-wrap
                    no-caps
                    dense
                    v-el-perms="'Addon.Inspector.Action.Info'"
                    @click="
                      () => {
                        onClickPlayerLgInfo(props.row)
                      }
                    "
                  >
                    <q-img src="inspectors/icons8-info.svg" width="25px" class="q-mr-xs" />
                    <div>Info</div>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showPlayerPhotoDialog" transition-show="slide-up" transition-hide="slide-down">
    <q-card square style="min-width: 300px">
      <q-card-section class="q-pa-none">
        <q-img
          class="q-pa-xs"
          :src="$playerPhotoUrl + selectedPlayer.id"
          style="width: 300px; height: 300px"
          :img-style="{ borderRadius: '3px' }"
          error-src="/assets/no-photo.png"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar, debounce } from 'quasar'
import { ref, defineAsyncComponent } from 'vue'
import SimpleKeyboard from 'src/components/ui/SimpleKeyboard.vue'
import { useInspectorStore } from 'src/stores/inspector-store'
const inspectorStore = useInspectorStore()
const $q = useQuasar()
const props = defineProps({
  currentTable: {
    type: Object,
    required: true,
  },
  gamingDateId: {
    type: Number,
    required: true,
  },
  disableTimeIn: {
    type: Boolean,
    required: true,
    default: () => false,
  },
})
defineEmits([...useDialogPluginComponent.emits])
const playersList = ref([])
const selectedPlayer = ref()
const selectedPlayerIndex = ref(-1)
const searchValue = ref('')

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const columns = ref([
  {
    name: 'id',
    align: 'center',
    label: 'Player ID',
    field: 'id',
    sortable: false,
    visible: false,
  },
  {
    name: 'fullName',
    align: 'center',
    label: 'Full Name',
    field: 'value',
    sortable: false,
    visible: true,
  },

  {
    name: 'photo',
    align: 'center',
    label: 'Player Photo',
    field: 'photo',
    sortable: false,
    visible: true,
  },
  {
    name: 'timeIn',
    align: 'center',
    label: 'TimeIn',
    field: 'timeIn',
    sortable: false,
    visible: true,
  },
])
const simpleKeyBoardTheme = ref('hg-theme-default')

const onKeyPress = (button) => {
  if (button === '{enter}') {
    onSubmitForm()
  }
}
const onInputChange = (input) => {
  searchValue.value = input
  debouncedOnSubmitForm()
}
const onInputFocus = (input) => {
  searchValue.value = input.target.value
}
const searchLoading = ref(false)

const onSubmitForm = async () => {
  selectedPlayer.value = null
  selectedPlayerIndex.value = -1
  let searchString = searchValue.value

  if (searchString === '') {
    playersList.value = []
    return
  }
  searchLoading.value = true
  playersList.value = await inspectorStore
    .searchPlayer(searchString)
    .then((res) => (playersList.value = res))
    .finally(() => {
      searchLoading.value = false
    })
}
const debouncedOnSubmitForm = debounce(onSubmitForm, 1000)
const onRowClick = (props) => {
  selectedPlayer.value = props.row
  selectedPlayerIndex.value = props.rowIndex
}

const onClickTimeIn = async (props) => {
  selectedPlayer.value = props.row
  selectedPlayerIndex.value = props.rowIndex
  if (selectedPlayer.value) {
    setTimeout(() => {
      onDialogOK(selectedPlayer.value)
    }, 200)
  }
}
const showPlayerPhotoDialog = ref(false)
const onClickPlayerPhoto = (player) => {
  selectedPlayer.value = player
  showPlayerPhotoDialog.value = true
}
const onClickPlayerLgInfo = async (player) => {
  let filterParams = {
    tableId: props.currentTable.id,
    gamingDateId: props.gamingDateId,
    playerId: player.id,
  }
  let playerLgInfo = await inspectorStore.getPlayerLgInfo(filterParams)
  $q.dialog({
    component: defineAsyncComponent(() => import('./PlayerLgInfoDialog.vue')),
    componentProps: {
      playerLgInfo: playerLgInfo,
      filterFn: inspectorStore.getPlayerLgInfo,
      filterParams: filterParams,
      player: player,
      table: props.currentTable,
    },
  })
}
</script>
