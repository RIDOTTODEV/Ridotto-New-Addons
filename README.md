# Addon Project (addon-new)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

1. transaction code eklenecek field
   "defaultIncludeInBalance": true, bu true ise alttakı gözükecek
   "includeCashlessAndChipScope": true,

2. Cage transaction da inlcuding balance kalkacak
   2.5 Cage transaction > chip > player chip include kalkacak
3. Player Operation CageTransaction include ve isdual kalacak
4. deposit withdraw ve addcashless'e isCorrection bu olacak label duzeltme kaydı olacak default => false ve chipde de olacak
