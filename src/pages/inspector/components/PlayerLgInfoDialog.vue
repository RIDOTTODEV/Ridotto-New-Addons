<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="" square style="min-width: 500px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="row">
          <div class="col-12 flex">
            <div class="text-subtitle1 text-bold flex content-end items-center">
              <q-icon name="o_info" size="sm" />
              {{ $t('playerLgInfo') }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          class="full-width"
          content="Oyuncunun masa ile ilgili bilgileri buradan görüntüleyebilirsiniz."
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <fieldset class="full-width row">
          <legend></legend>
          <div class="col-12 text-center">
            <div class="text-h5 text-bold text-blue-8">
              {{ player.playerName }}
            </div>
          </div>
          <div class="col-12 text-center">
            <div class="text-h6 text-bold text-negative">
              <div v-if="!allTables">( {{ table.name }})</div>
              <div v-else>( {{ $t('allTables') }})</div>
            </div>
          </div>
        </fieldset>

        <div class="row q-mt-md">
          <div class="col-6 q-pa-xs flex justify-center items-center content-center">
            <div class="text-subtitle1 text-bold text-blue-8">CASH DROP</div>
          </div>
          <div class="col-6 q-pa-xs">
            <q-input
              :model-value="priceAbsFormatted(playerLgInfo.cashDrop)"
              class="super-small"
              readonly
              dense
              outlined
            />
          </div>

          <div class="col-6 q-pa-xs flex justify-center items-center content-center">
            <div class="text-subtitle1 text-bold text-blue-8">PLAQ DROP</div>
          </div>
          <div class="col-6 q-pa-xs">
            <q-input
              :model-value="priceAbsFormatted(playerLgInfo.chipDrop)"
              class="super-small"
              readonly
              dense
              outlined
            />
          </div>
          <div class="col-6 q-pa-xs flex justify-center items-center content-center">
            <div class="text-subtitle1 text-bold text-negative">CHIPS HELD</div>
          </div>
          <div class="col-6 q-pa-xs">
            <q-input
              :model-value="priceAbsFormatted(playerLgInfo.chipsHeld)"
              class="super-small"
              readonly
              dense
              outlined
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-pa-xs">
            <fieldset class="row">
              <legend>
                <div class="text-caption">Cage Information</div>
              </legend>
              <div class="col-12 row">
                <div class="col-4 q-pa-xs flex justify-start items-center content-center">
                  <div class="text-subtitle1 text-bold text-positive">CAGE IN</div>
                </div>
                <div class="col-8 q-pa-xs">
                  <q-input
                    :model-value="priceAbsFormatted(playerLgInfo.cageIn)"
                    class="super-small"
                    readonly
                    dense
                    outlined
                  />
                </div>
              </div>
              <div class="col-12 row">
                <div class="col-4 q-pa-xs flex justify-start items-center content-center">
                  <div class="text-subtitle1 text-bold text-blue-8">CC</div>
                </div>
                <div class="col-8 q-pa-xs">
                  <q-input
                    :model-value="priceAbsFormatted(playerLgInfo.cc)"
                    class="super-small"
                    readonly
                    dense
                    outlined
                  />
                </div>
              </div>
              <div class="col-12 row">
                <div class="col-4 q-pa-xs flex justify-start items-center content-center">
                  <div class="text-subtitle1 text-bold text-blue-8">CASH</div>
                </div>
                <div class="col-8 q-pa-xs">
                  <q-input
                    :model-value="priceAbsFormatted(playerLgInfo.cash)"
                    class="super-small"
                    readonly
                    dense
                    outlined
                  />
                </div>
              </div>
              <div class="col-12 row">
                <div class="col-4 q-pa-xs flex justify-start items-center content-center">
                  <div class="text-subtitle1 text-bold text-blue-8">DEPOSIT</div>
                </div>
                <div class="col-8 q-pa-xs">
                  <q-input
                    :model-value="priceAbsFormatted(playerLgInfo.deposit)"
                    class="super-small"
                    readonly
                    dense
                    outlined
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-6 q-pl-xs q-pb-xs q-pr-xs" style="padding-top: 11px">
            <q-markup-table dense separator="cell" bordered flat class="full-height">
              <thead>
                <tr>
                  <th class="text-center">Denom</th>
                  <th class="text-center">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(denom, index) in playerLgInfo.chipInPocketDetails" :key="index">
                  <td class="text-center">{{ denom.chipDenom }}</td>
                  <td class="text-center">{{ denom.quantity }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row flex justify-center items-center">
        <q-btn
          size="md"
          class=""
          color="grey-2"
          text-color="black"
          icon="sync"
          :label="!allTables ? $t('allTables') : $t('thisTable')"
          @click="toggleAllTables"
          unelevated
          no-caps
        />
        <q-btn
          size="md"
          class="q-ml-sm"
          color="negative"
          icon="far fa-check-circle"
          :label="$t('close')"
          @click="onOKClick"
          unelevated
          no-caps
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'

const props = defineProps({
  playerLgInfo: {
    type: Object,
    required: true,
  },
  filterFn: {
    type: Function,
    required: true,
  },
  filterParams: {
    type: Object,
    required: true,
  },
  player: {
    type: Object,
    required: true,
  },
  table: {
    type: Object,
    required: true,
  },
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const onOKClick = async () => {
  onDialogOK({})
}

onMounted(async () => {})
const playerLgInfo = ref(props.playerLgInfo)
const filterParams = ref(props.filterParams)
const allTables = ref(false)
const toggleAllTables = async () => {
  allTables.value = !allTables.value
  if (allTables.value) {
    filterParams.value = {
      ...filterParams.value,
      tableId: null,
    }
  } else {
    filterParams.value = {
      ...filterParams.value,
      tableId: props.table.id,
    }
  }
  await props.filterFn(filterParams.value).then((res) => {
    playerLgInfo.value = res
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
</style>
