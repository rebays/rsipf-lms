import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getCurrentUser } from '@/lib/auth'
import {
  renderToBuffer,
  Document,
  Image as PdfImage,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  border: {
    borderWidth: 4,
    borderColor: '#0a1f3a',
    padding: 30,
    flex: 1,
  },
  header: { textAlign: 'center', marginBottom: 24 },
  crest: { width: 70, height: 84, alignSelf: 'center', marginBottom: 12 },
  brand: { fontSize: 12, color: '#8c7232', letterSpacing: 2, textAlign: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0a1f3a',
    textAlign: 'center',
    marginTop: 10,
  },
  text: { fontSize: 12, textAlign: 'center', color: '#444', marginTop: 8 },
  recipient: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    color: '#0a1f3a',
  },
  course: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 14,
    fontWeight: 700,
  },
  meta: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#666',
  },
})

function isDbError(err: unknown): boolean {
  const code = (err as any)?.code ?? (err as any)?.cause?.code
  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'].includes(code)) return true
  const msg = err instanceof Error ? err.message : ''
  return /connection refused|connection timeout|ECONN|ETIMEDOUT/i.test(msg)
}

type Args = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Args) {
  try {
    const { id } = await params
    const { user, payload } = await getCurrentUser()
    if (!user) return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })

    const cert = await payload.findByID({
      collection: 'certificates',
      id,
      depth: 2,
      user,
    })

    if (!cert) return NextResponse.json({ message: 'Certificate not found' }, { status: 404 })

    const officerName = typeof cert.officer === 'object' ? cert.officer.name : 'Officer'
    const courseTitle = typeof cert.course === 'object' ? cert.course.title : 'Course'
    const issued = new Date(cert.issuedAt).toLocaleDateString()

    const logoBytes = await readFile(path.join(process.cwd(), 'public', 'rsipf-logo.png'))
    const logoSrc = `data:image/png;base64,${logoBytes.toString('base64')}`

    const doc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', orientation: 'landscape', style: styles.page },
        React.createElement(
          View,
          { style: styles.border },
          React.createElement(
            View,
            { style: styles.header },
            React.createElement(PdfImage, { src: logoSrc, style: styles.crest }),
            React.createElement(Text, { style: styles.brand }, 'ROYAL SOLOMON ISLANDS POLICE FORCE'),
            React.createElement(Text, { style: styles.title }, 'Certificate of Completion'),
          ),
          React.createElement(Text, { style: styles.text }, 'This certifies that'),
          React.createElement(Text, { style: styles.recipient }, officerName),
          React.createElement(Text, { style: styles.text }, 'has successfully completed the course'),
          React.createElement(Text, { style: styles.course }, courseTitle),
          React.createElement(
            View,
            { style: styles.meta },
            React.createElement(Text, null, `Certificate № ${cert.certificateNumber}`),
            React.createElement(Text, null, `Issued ${issued}`),
          ),
        ),
      ),
    )

    const buffer = await renderToBuffer(doc as any)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${cert.certificateNumber}.pdf"`,
      },
    })
  } catch (err) {
    if (isDbError(err)) {
      return NextResponse.json({ message: 'Database unavailable. Please try again later.' }, { status: 503 })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
