import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',       // sesuaikan username DB lo
  host: 'localhost',
  database: 'payroll',   // atau database khusus misal 'semba_db'
  password: 'admin123',   // password DB lo
  port: 5432,
})

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ Connection error', err.stack))

export default pool
