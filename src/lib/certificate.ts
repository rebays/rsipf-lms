export const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6).padEnd(6, '0')
  return `RSIPF-${year}-${random}`
}
