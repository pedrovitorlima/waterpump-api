import { Pool } from 'pg'

require('dotenv').config();

const user = process.env.PGUSER
const password = process.env.PGPASSWORD
const hostname = process.env.PGHOST
const port = process.env.PGPORT
const dbname = process.env.PGDATABASE

export default new Pool(
    {
    max: 20,
    connectionString: 'postgres://' + user + ':' + password + '@' + hostname + ':' + port + '/' + dbname
})