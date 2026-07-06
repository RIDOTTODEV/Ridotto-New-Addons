<template>
  <q-page class="q-pa-md">
    <!-- <Dashboard /> -->
    <ATable />
    <ejs-pivotview :height="height" :width="width" :dataSourceSettings="dataSourceSettings"></ejs-pivotview>

  </q-page>
</template>

<script setup>
// import Dashboard from 'src/components/pages/dashboard/Dashboard.vue'
import ATable from 'src/components/atoms/atable/ATable.vue'


import { PivotViewComponent as EjsPivotview } from '@syncfusion/ej2-vue-pivotview';
import { registerLicense } from '@syncfusion/ej2-base'

registerLicense(process.env.SYNCFUSION_KEY);




const dataSourceSettings = {
  dataSource: [
    { 'Sold': 31, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2025', 'Quarter': 'Q1' },
    { 'Sold': 51, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2025', 'Quarter': 'Q2' },
    { 'Sold': 90, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2025', 'Quarter': 'Q3' },
    { 'Sold': 25, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2025', 'Quarter': 'Q4' }
  ],
  expandAll: true,
  columns: [{ name: 'Year' }, { name: 'Quarter' }],
  rows: [{ name: 'Country' }, { name: 'Products' }],
  values: [{ name: 'Amount', caption: 'Sold Amount' }, { name: 'Sold', caption: 'Units Sold' }],
  formatSettings: [{ name: 'Amount', format: 'C0' }]
};
const height = 350;
const width = '100%';
</script>
