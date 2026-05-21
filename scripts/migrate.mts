process.env.PAYLOAD_SECRET ||= 'dev-secret-change-me'

const { default: payload } = await import('payload')
const { default: config } = await import('../src/payload.config')

await payload.init({ config, disableOnInit: true })
await payload.db.migrate()
process.exit(0)
