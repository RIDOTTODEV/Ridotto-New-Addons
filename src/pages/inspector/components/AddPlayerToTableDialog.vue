<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class=" " square style="min-width: 800px">
      <q-card-section class="app-cart-grey q-pa-xs flex justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ playersList.length === 0 ? $t('findCustomer') : $t('players') }}
          <span class="text-negative">*</span>
        </div>
        <q-btn
          class="text-bold q-mr-sm"
          unelevated
          outline
          @click="onClickCloseSelectPlayerForm"
          v-if="playersList.length"
        >
          <template v-slot:default>
            <div class="row">
              <q-img src="/inspectors/icons8-remove-48.png" style="width: 20px" />
            </div>
          </template>
        </q-btn>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Information
          class="full-width"
          content="Oyuncu araması için kullanılır ve seçilen oyuncu time in yapılarak masaya oturtulur."
        />
      </q-card-section>
      <q-card-section v-if="playersList.length === 0">
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col">
                <q-input
                  v-model="formValue.id"
                  outlined
                  dense
                  :label="$t('searchPlayer')"
                  for="id"
                  @focus="onInputFocus"
                  @input="onInputChange"
                  type="text"
                  @keydown.enter="onSubmitForm"
                  autofocus
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
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none" v-if="playersList.length === 0">
        <SimpleKeyboard
          :input="formValue[currentInputName]"
          :inputName="currentInputName"
          @onChange="onChange"
          @onKeyPress="onKeyPress"
          :theme-name="simpleKeyBoardTheme"
        />
      </q-card-section>
      <q-card-section class="q-pr-xs q-pt-none q-pl-xs" v-if="playersList.length">
        <div class="row">
          <div class="col-12 q-pa-xs">
            <div class="row">
              <div class="col-12">
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
                >
                  <template v-slot:body="props">
                    <q-tr
                      :props="props"
                      :class="
                        selectedPlayer?.id === props.row.id
                          ? 'bg-negative text-white'
                          : 'cursor-pointer'
                      "
                    >
                      <q-td key="id" :props="props" @click="onRowClick(props)">
                        {{ props.row.id }}
                      </q-td>
                      <q-td key="name" :props="props" @click="onRowClick(props)">
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="surname" :props="props" @click="onRowClick(props)">
                        {{ props.row.surname }}
                      </q-td>
                      <q-td key="photo" :props="props" @click="onRowClick(props)">
                        <q-img
                          :src="
                            props.row && props.row.profilePhoto !== null
                              ? props.row?.profilePhoto
                              : '/assets/no-photo.png'
                          "
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
                        >
                          <q-img
                            src="/inspectors/icons8-time-machine-40.png"
                            width="25px"
                            class="q-mr-xs"
                          />
                          <div class="q-ml-md text-negative text-capitalize">
                            <span
                              :class="
                                selectedPlayer?.id === props.row.id ? 'text-white' : 'text-dark'
                              "
                              >{{ $t('timeIn') }}</span
                            >
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
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
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
})
defineEmits([...useDialogPluginComponent.emits])
const playersList = ref([])
const selectedPlayer = ref()
const selectedPlayerIndex = ref(-1)
const formValue = ref({
  id: '',
  name: '',
  surname: '',
})
const currentInputName = ref('id')
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
    name: 'name',
    align: 'center',
    label: 'Name',
    field: 'name',
    sortable: false,
    visible: true,
  },
  {
    name: 'surname',
    align: 'center',
    label: 'Surname',
    field: 'surname',
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
const onChange = (input) => {
  formValue.value = {
    ...formValue.value,
    [currentInputName.value]: input,
  }
}
const onKeyPress = (button) => {
  if (button === '{enter}') {
    onSubmitForm()
  }
}
const onInputChange = (input) => {
  formValue.value[input.target.id] = input.target.value
}
const onInputFocus = (input) => {
  currentInputName.value = input.target.id
}

/* const onClickCleanInput = () => {
  formValue.value = {
    ...formValue.value,
    [currentInputName.value]: "",
  };
};
const onClickChangeKeyboardTheme = () => {
  if (simpleKeyBoardTheme.value === "hg-theme-default") {
    simpleKeyBoardTheme.value =
      "hg-theme-default hg-layout-numeric numeric-theme";
  } else {
    simpleKeyBoardTheme.value = "hg-theme-default";
  }
}; */
const onSubmitForm = async () => {
  selectedPlayer.value = null
  selectedPlayerIndex.value = -1
  let searchString = ''
  switch (currentInputName.value) {
    case 'id':
      searchString = formValue.value.id
      break
    case 'name':
      searchString = formValue.value.name
      break
    case 'surname':
      searchString = formValue.value.surname
      break
  }
  if (searchString === '') {
    return
  }
  playersList.value = await inspectorStore
    .fetchPlayers(searchString)
    .then((res) => (playersList.value = res))
}

const onRowClick = (props) => {
  selectedPlayer.value = props.row
  selectedPlayerIndex.value = props.rowIndex
}
/* const navigateSelectedPLayer = (action = "down") => {
  if (playersList.value.length === 0) {
    return;
  }
  if (selectedPlayerIndex.value === -1) {
    selectedPlayerIndex.value = 0;
    selectedPlayer.value = playersList.value[selectedPlayerIndex.value];
    return;
  }
  if (action === "down") {
    if (selectedPlayerIndex.value === playersList.value.length - 1) {
      selectedPlayerIndex.value = 0;
    } else {
      selectedPlayerIndex.value += 1;
    }
  } else {
    if (selectedPlayerIndex.value === 0) {
      selectedPlayerIndex.value = playersList.value.length - 1;
    } else {
      selectedPlayerIndex.value -= 1;
    }
  }
  selectedPlayer.value = playersList.value[selectedPlayerIndex.value];
};
 */
const onClickCloseSelectPlayerForm = () => {
  selectedPlayerIndex.value = -1
  selectedPlayer.value = null
  playersList.value = []
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
