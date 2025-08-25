import dotenv from 'dotenv'

const files = {
  ...dotenv.config({ path: './.env' }).parsed,
  ...dotenv.config({ path: `./.env.${process.env.ENVIRONMENT}` }).parsed,
}

export function parseEnv() {
  for (const key in files) {
    if (typeof files[key] !== 'string') {
      files[key] = JSON.stringify(files[key])
    }
  }
  return files
}

export default parseEnv
