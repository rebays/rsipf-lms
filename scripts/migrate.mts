const env = process.env as Record<string, string>
env.PAYLOAD_SECRET = env.PAYLOAD_SECRET || 'dev-secret-change-me'
env.NODE_ENV = 'development'
env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

const { default: payload } = await import('payload')
const { default: config } = await import('../src/payload.config')

await payload.init({ config, disableOnInit: true })
process.exit(0)
