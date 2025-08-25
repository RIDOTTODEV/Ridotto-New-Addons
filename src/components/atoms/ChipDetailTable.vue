<template>
  <q-markup-table dense square class="q-ma-none" flat bordered separator="cell">
    <thead>
      <tr class="bg-grey-1">
        <th v-for="header in header" :key="header" class="text-center">
          {{ $t(camelCaseToSentence(header)) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in chips" :key="index">
        <td v-for="header in header" :key="header" class="text-center">
          <span v-if="header === 'amount'">
            {{ priceAbsFormatted(item[header]) }}
          </span>
          <span v-else>
            {{ item[header] }}
          </span>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
import { priceAbsFormatted } from 'src/helpers/helpers'
defineProps({
  chips: {
    type: Array,
    required: true,
  },
  header: {
    type: Array,
    required: true,
  },
})
const camelCaseToSentence = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase()
  })
}
</script>

<style scoped></style>
