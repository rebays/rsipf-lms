process.env.PAYLOAD_SECRET ||= 'dev-secret-change-me'
process.env.NODE_ENV = 'development'
process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

const { default: payload } = await import('payload')
const { default: config } = await import('../src/payload.config')

await payload.init({ config, disableOnInit: true })
process.exit(0)
