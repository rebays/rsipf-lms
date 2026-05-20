// Patches @next/env to expose a `default` export.
//
// Why: @next/env's CJS bundle sets `__esModule: true` on its exports object but
// never assigns a `default` property. Payload's `bin/loadEnv.js` does
// `import nextEnvImport from '@next/env'` and then destructures
// `loadEnvConfig` off it. Under tsx's CJS/ESM interop the default-import
// returns `undefined`, crashing every script (including our seed) that
// transitively loads `payload/node`. Adding `n.default = n` to the bundle's
// final line fixes the interop without changing behavior.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const target = 'node_modules/@next/env/dist/index.js'
if (!existsSync(target)) {
  console.log('[patch-next-env] target not found, skipping')
  process.exit(0)
}

let source = readFileSync(target, 'utf8')
if (source.includes('n.default=n')) {
  console.log('[patch-next-env] already patched')
  process.exit(0)
}

const patched = source.replace(/module\.exports=n\}\)\(\);\s*$/, 'n.default=n;module.exports=n})();')
if (patched === source) {
  console.warn('[patch-next-env] could not locate end-of-bundle pattern — skipping')
  process.exit(0)
}

writeFileSync(target, patched)
console.log('[patch-next-env] patched')
