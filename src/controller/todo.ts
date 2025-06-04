import { db } from '../utils/db'

console.log(db.query("select 'test' as test").get())
