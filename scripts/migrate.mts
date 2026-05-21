import payload from 'payload'
import config from '../src/payload.config'

await payload.init({ config, disableOnInit: true })
await payload.db.migrate()
process.exit(0)
