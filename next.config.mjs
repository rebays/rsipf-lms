import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: false,
}

const config = withPayload(nextConfig)
delete config.experimental?.turbopackServerFastRefresh

export default config
