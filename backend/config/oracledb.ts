import { resolve } from 'path'
import { config } from 'dotenv'

const envPath = `${process.env.NODE_ENV === 'development' ? '' : '../'}../config/.env`

config({ path: resolve(__dirname, envPath) })

const connection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING,
}

export default connection
