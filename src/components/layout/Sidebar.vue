<template>
  <q-drawer v-model="sideBarDrawer" show-if-above :width="235" :breakpoint="400" class="sidebar">
    <q-scroll-area
      style="height: calc(100% - 90px); margin-top: 70px"
      :thumb-style="{ opacity: 0 }"
    >
      <q-list separator>
        <div v-for="(menu, index) in menus" :key="index">
          <q-item
            v-if="menu.type === 'menu'"
            class="singleMenu expansionMenu mt-2"
            active-class="active-menu "
            clickable
            v-ripple
            dense
            :active="currentRouteName === menu.routeName"
            :to="
              menu?.params
                ? { name: menu.routeName, params: menu.params }
                : { name: menu.routeName }
            "
            v-el-perms="menu.permission"
          >
            <q-item-section>
              <div
                class="row flex no-wrap justify-between text-caption content-center items-center"
              >
                <div class="text-subtitle2">{{ $t(`${menu.title}`) }}</div>
                <q-icon :name="menu.icon" size="15px" />
              </div>
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="menu.type === 'dropdown'"
            class="full-width menu text-subtitle2"
            dense
            :default-opened="currentRouteMeta === menu.name"
            expand-icon-class="text-white"
            @show="expansionOnHandleShow(menu.name)"
            :name="menu.name"
            :key="index"
            ref="expansionRefs"
            header-class="expansionHeader expansionMenu"
            v-el-perms="menu.permission"
          >
            <template v-slot:header>
              <q-item class="q-pa-none q-ma-none full-width">
                <q-item-section>{{ $t(menu.title) }}</q-item-section>
              </q-item>
            </template>
            <q-card class="bg-transparent q-pa-none">
              <!-- :class="menu.subMenus.length >= 7 ? 'subMenuScroll' : ''" -->
              <q-card-section class="q-pa-none">
                <q-list separator dense>
                  <div v-for="(item, index) in menu.subMenus" :key="index">
                    <q-item
                      v-if="item.type !== 'dropdown'"
                      class="menu menuHover"
                      active-class="active-menu"
                      clickable
                      v-ripple
                      dense
                      :active="currentRouteName === item.routeName"
                      :to="{ name: item.routeName }"
                      v-el-perms="item?.permission"
                    >
                      <q-item-section>
                        <div
                          class="row flex no-wrap justify-start text-caption content-center items-center"
                        >
                          <q-icon :name="item.icon" size="15px" class="q-mr-sm" />
                          {{ $t(`${item.title}`) }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-expansion-item
                      v-if="item.type === 'dropdown' && item.subMenus.length > 0"
                      :class="
                        currentRouteMeta === item.name
                          ? 'full-width  menu text-caption'
                          : 'full-width  menu text-caption'
                      "
                      dense
                      :default-opened="currentRouteMeta === item.name"
                      expand-icon-class="text-white"
                      @show="expansionOnHandleShow(item.name, menu.name)"
                      :name="item.name"
                      :key="index"
                      ref="expansionRefs"
                      header-class="expansionHeader "
                    >
                      <template v-slot:header>
                        <q-item class="q-pa-none q-ma-none full-width">
                          <q-item-section class="q-ml-xs text-body2 text-bold">{{
                            $t(item.title)
                          }}</q-item-section>
                        </q-item>
                      </template>
                      <q-card class="bg-transparent q-pa-none">
                        <q-card-section class="q-pa-none">
                          <q-list separator>
                            <q-item
                              v-for="(subItem, index) in item.subMenus"
                              :key="index"
                              class="menu text-body2"
                              active-class="active-menu"
                              clickable
                              v-ripple
                              :active="currentRouteName === subItem.routeName"
                              :to="{ name: subItem.routeName }"
                              v-el-perms="subItem?.permission"
                            >
                              <q-item-section class=" ">
                                <div
                                  class="row flex no-wrap justify-start text-caption content-center items-center"
                                >
                                  <q-icon :name="subItem.icon" size="15px" class="q-mr-sm" />
                                  {{ $t(`${subItem.title}`) }}
                                </div>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </div>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-list>
    </q-scroll-area>
    <q-img class="absolute-top cursor-pointer sideBarBg" height="70px">
      <div class="text-center sideBarBg">
        <img src="/assets/logo.png" @click="router.push({ name: 'index' })" width="200px" />
      </div>
    </q-img>
    <div class="absolute-bottom bg-blue-grey-8">
      <Timer />
    </div>
  </q-drawer>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainStore } from 'src/stores/main-store'
import Timer from 'src/components/ui/Timer.vue'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: () => true,
    required: false,
  },
})
const mainStore = useMainStore()
const { menus } = storeToRefs(mainStore)
const router = useRouter()
const route = useRoute()
const currentRouteName = ref(route.name)
const currentRouteMeta = ref(route.meta.groupName)

const expansionRefs = ref([])
const sideBarDrawer = ref(props.drawer)

watch(
  () => route.name,
  (to) => {
    currentRouteName.value = to
    currentRouteMeta.value = route.meta.groupName
  },
)
watch(
  () => props.drawer,
  (to) => {
    sideBarDrawer.value = to
  },
)

const expansionOnHandleShow = (name, parentName = null) => {
  // make hide all other expansion items sonra düzelticem
  if (parentName) {
    expansionRefs.value.forEach((ref) => {
      if (ref.$attrs.name !== name && ref.$attrs.name !== parentName) {
        ref.hide()
      }
    })
  }
  expansionRefs.value.forEach((ref) => {
    if (ref.$attrs.name !== name && ref.$attrs.name !== parentName) {
      ref.hide()
    }
  })
}

const emit = defineEmits(['update:drawer'])
// watch sideBarDrawer
watch(sideBarDrawer, (to) => {
  emit('update:drawer', to)
})
</script>
<style lang="scss">
.activeMenuHeader {
  .q-expansion-item__container {
    .expansionHeader {
      background-color: #42627f !important;
    }
  }
}
.expansionMenu {
  background-color: #42627f !important;
}
.mt-2 {
  margin-top: 2px !important;
}
.subMenuScroll {
  height: 340px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #dddddd transparent;
}
</style>
