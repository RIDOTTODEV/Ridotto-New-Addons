<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
  >
    <q-card square class="">
      <q-card-section class="q-pa-none app-content-bg row flex justify-between">
        <div class="text-subtitle1 text-bold flex items-center">
          <q-icon name="o_person" size="sm" /> {{ playerName }}
        </div>
        <q-separator />
        <q-btn
          no-caps
          color="grey-8"
          rounded
          round
          flat
          unelevated
          icon="far fa-times-circle"
          @click="onDialogCancel"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-4 q-pa-sm">
            <q-card flat class="bg-transparent">
              <q-tabs
                v-model="playerOrderTab"
                dense
                class="text-grey"
                active-color="blue-grey-8"
                indicator-color="blue-grey-8"
                active-bg-color="blue-grey-1"
                align="justify"
                narrow-indicator
                no-caps
                inline-label
                shrink
              >
                <q-tab
                  no-caps
                  name="newOrder"
                  icon="o_loyalty"
                  :label="$t('newOrder')"
                  class="q-card--bordered"
                />
                <q-tab
                  no-caps
                  name="oldOrders"
                  icon="history"
                  :label="$t('oldOrders')"
                  class="q-card--bordered q-ml-sm"
                />
              </q-tabs>
              <q-separator class="q-mt-sm q-mb-sm" />
              <q-tab-panels v-model="playerOrderTab" animated class="panelContent">
                <q-tab-panel name="newOrder" class="q-card--bordered q-pa-none">
                  <q-card flat square>
                    <q-card-section class="q-pa-none">
                      <q-item clickable v-ripple class="col-12 q-pa-sm bg-blue-grey-1" dense>
                        <q-item-section>
                          <q-item-label class="text-dark text-subtitle1 text-bold">
                            {{ $t('newOrderList') }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <div class="row flex text-subtitle2 text-dark">
                            <q-icon name="o_loyalty" size="20px" class="q-mr-sm" />
                            <span class="q-mr-xs">{{ $t('orderList') }}</span>
                            (<span class="text-bold">{{ order.products.length }}</span
                            >)
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-card-section class="q-pa-none">
                      <q-scroll-area style="height: calc(100vh - 180px)">
                        <q-list separator>
                          <q-item
                            v-for="(item, index) in order.products"
                            dense
                            :key="index"
                            clickable
                            :active="selectedOrderItem.index === index"
                            active-class="selectedProduct"
                            class="q-pl-none q-pr-none"
                          >
                            <q-item-section avatar>
                              <div class="flex q-ml-xs">
                                <q-btn
                                  unelevated
                                  :color="
                                    selectedOrderItem?.index === index ? 'white' : 'secondary'
                                  "
                                  outline
                                  style="width: 40px"
                                  label="-"
                                  class="text-bold"
                                  @click="decreaseProduct(index)"
                                  :text-color="
                                    selectedOrderItem?.index === index ? 'white' : 'grey-9'
                                  "
                                />

                                <q-btn
                                  unelevated
                                  outline
                                  style="width: 40px"
                                  :label="item.quantity"
                                  class="q-mx-sm text-bold"
                                  :color="
                                    selectedOrderItem?.index === index ? 'white' : 'secondary'
                                  "
                                  :text-color="
                                    selectedOrderItem?.index === index ? 'white' : 'grey-9'
                                  "
                                />
                                <q-btn
                                  unelevated
                                  :color="
                                    selectedOrderItem?.index === index ? 'white' : 'secondary'
                                  "
                                  outline
                                  style="width: 40px"
                                  label="+"
                                  class="text-bold"
                                  @click="increaseProduct(index)"
                                  :text-color="
                                    selectedOrderItem?.index === index ? 'white' : 'grey-9'
                                  "
                                />
                              </div>
                            </q-item-section>
                            <q-item-section @click="onSelectOrderItem(item, index)">
                              <div class="text-subtitle1 text-capitalize">
                                {{ item.productName }}
                              </div>
                              <div class="row flex justify-start" style="margin-top: -5px">
                                <div
                                  class="text-subtitle2 q-pr-md"
                                  v-if="item.portionSetId && item.portion"
                                >
                                  {{ textCapitalize(item.portion) }}
                                </div>
                                <div
                                  class="text-subtitle2 q-pr-md"
                                  v-if="item.extraSetId && item.extras"
                                >
                                  {{ textCapitalize(item.extras) }},
                                </div>
                                <div class="text-subtitle2 q-pr-md" v-if="item.note">
                                  <b>{{ $t('note') }}:</b>
                                  {{ textCapitalize(item?.note) }}
                                </div>
                              </div>
                            </q-item-section>
                            <q-item-section side>
                              <q-icon
                                class="q-mr-sm"
                                @click="
                                  productPortionAndExtra(selectedOrderItem.product, 'update', true)
                                "
                                size="2rem"
                                name="o_info"
                                :color="selectedOrderItem?.index === index ? 'white' : 'grey-6'"
                              />
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-scroll-area>
                      <div class="row justify-end">
                        <q-btn
                          color="grey-2"
                          unelevated
                          class="q-card--bordered full-width absolute-bottom"
                          text-color="dark"
                          no-wrap
                          no-caps
                          size="17px"
                          :disabled="order.products.length === 0"
                          @click="completeOrder"
                        >
                          <q-img
                            src="/inspectors/icons8-waiter-64.png"
                            width="25px"
                            class="q-mr-xs"
                          />
                          <div>{{ $t('completeOrder') }}</div>
                        </q-btn>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="oldOrders">
                  <q-card flat square>
                    <q-card-section class="q-pa-none">
                      <q-scroll-area style="height: calc(100vh - 180px)" class="q-pl-sm q-pr-sm">
                        <div
                          :class="
                            $q.dark.isActive
                              ? 'q-ma-sm bg-grey-10 full-width row'
                              : 'q-ma-sm bg-grey-1 full-width row'
                          "
                          v-for="(o, i) in playerOrders"
                          :key="i"
                        >
                          <div class="col-12 row" v-for="(p, k) in o.products" :key="k">
                            <div class="col-10">
                              <div class="row">
                                <div class="text-subtitle2 text-grey-8">
                                  {{ date.formatDate(p.createdAt, 'DD.MM.YYYY HH:mm') }}
                                </div>
                              </div>
                              <div class="row">
                                <div class="text-subtitle2">
                                  {{ p.productName }}
                                </div>
                                <span class="q-ml-sm" v-if="p.portion"> {{ p.portion }}</span>
                                <span class="q-ml-sm" v-if="p.extra"> {{ p.extra }}</span>
                                <q-badge
                                  v-if="p?.status === 'New'"
                                  color="warning"
                                  text-color="dark"
                                  class="q-ml-sm"
                                >
                                  {{ p.status }}
                                </q-badge>
                              </div>
                            </div>
                            <div class="col-1 flex content-center justify-center">
                              <div class="text-subtitle1 text-bold">X{{ p.quantity }}</div>
                            </div>
                            <div class="col-1 flex content-center justify-end">
                              <q-btn
                                v-if="showCancelOrderBtn(p?.orderTagId)"
                                icon="o_delete_forever"
                                flat
                                :disabled="p.status !== 'New'"
                                name=""
                                @click="onClickCancelOrder(p)"
                                color="negative"
                                class="q-ml-sm cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </q-scroll-area>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
          <div class="col-3 q-pa-sm">
            <q-card flat square class="bg-transparent" v-if="categoryHistory.length > 0">
              <q-card-section class="q-pa-none" style="height: calc(100vh - 180px)">
                <div class="post-category">
                  <div class="pos__categories__inner">
                    <div
                      class="pos__category col-12 cursor-pointer is-back"
                      style="min-width: 100% !important"
                      @click="onClickBack"
                    >
                      <q-icon name="arrow_back" size="2rem" class="q-mr-sm" />
                      {{ $t('back') }}
                    </div>
                    <div
                      class="pos__category col-12 cursor-pointer"
                      :style="
                        fetchFavoriteProduct
                          ? {
                              minWidth: '100% !important',
                              backgroundColor: '#ff3568!important',
                              color: 'white',
                            }
                          : { minWidth: '100% !important' }
                      "
                      v-if="categoryHistory.length > 0"
                      @click="onClickFavorite"
                    >
                      <q-icon
                        :name="fetchFavoriteProduct ? 'favorite' : 'favorite_border'"
                        size="2rem"
                        class="q-mr-sm"
                      />
                      {{ $t('favorites') }}
                    </div>
                    <div
                      class="pos__category cursor-pointer"
                      v-for="(item, index) in categories"
                      :key="index"
                      @click="onClickCategory(item)"
                    >
                      <div class="">
                        {{ textCapitalize(getNameOfObject(item)) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-5 q-pl-sm q-pr-sm">
            <q-card flat square class="bg-transparent">
              <q-card-section class="row q-pt-none">
                <q-scroll-area style="height: 500px; width: 100% !important">
                  <div class="row">
                    <div
                      class="col-4"
                      v-for="(product, index) in orderByAlphabeticProducts"
                      :key="index"
                      @click="onClickProduct(product)"
                    >
                      <div
                        v-ripple
                        class="relative-position text-capitalize container flex justify-center text-subtitle2 text-center content-center cursor-pointer q-ma-sm productBtn q-card--bordered"
                        style="height: 60px"
                      >
                        {{ textCapitalize(product.productName) }}
                      </div>
                    </div>
                  </div>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { useInspectorOrder } from 'src/composables/inspectors/useInspectorOrder'
const {
  playerOrderTab,
  order,
  playerOrders,
  selectedOrderItem,
  categories,
  categoryHistory,
  fetchFavoriteProduct,
  orderByAlphabeticProducts,
  onClickCategory,
  onClickBack,
  onClickFavorite,
  onClickProduct,
  increaseProduct,
  decreaseProduct,
  onSelectOrderItem,
  completeOrder,
  onClickCancelOrder,
  getNameOfObject,
  textCapitalize,
  productPortionAndExtra,
  date,
  showCancelOrderBtn,
} = useInspectorOrder()
defineProps({
  playerName: {
    type: String,
    required: true,
  },
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
</script>
<style scoped class="scss">
.post-category {
  flex: 4;
  overflow: hidden;
  width: 100%;
  position: relative;
  height: 100%;
}

.pos__categories__inner {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  flex-wrap: wrap;
  /* height: calc(100vh - 310px); */
  height: 100%;
  overflow: auto;
}

.pos__category {
  flex: 1 0 calc(50% - 0.9rem);
  border: 0.05rem #ccc solid;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.25rem;
  font-size: 125%;
  font-weight: 600;
  transition:
    background-color 200ms ease,
    color 200ms ease;
  white-space: normal;
  text-align: center;
}

.selectedProduct {
  background-color: #ff3568 !important;
  color: white !important;
}

.hB {
  min-height: 68px !important;
}

.hB:hover {
  background-color: #ff3568 !important;
  color: white !important;
}

.is-back {
  background-color: #ecf1f6 !important;
  color: black !important;
}

.panelContent .q-tab-panel {
  padding: 0px !important;
}
</style>
