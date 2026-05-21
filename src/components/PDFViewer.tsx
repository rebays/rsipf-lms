'use client'

import { useState } from 'react'

interface Props {
  title: string
  url: string
}

export const PDFViewer = ({ title, url }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="card card--row">
        <div className="card__icon">
          <span style={{ fontSize: '1.75rem' }}>📄</span>
        </div>
        <div className="card__body">
          <h3 className="card__title">{title}</h3>
          <span className="badge badge--neutral mt-2">PDF</span>
        </div>
        <div className="card__action" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn--sm btn--secondary" onClick={() => setOpen(true)}>
            View
          </button>
          <a href={url} download className="btn btn--sm">
            Download
          </a>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              background: '#0a1f3a',
              color: '#fff',
            }}
          >
            <span style={{ fontWeight: 600 }}>{title}</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Close viewer"
            >
              ×
            </button>
          </div>
          <iframe
            src={url}
            style={{ flex: 1, width: '100%', border: 'none' }}
            title={title}
          />
        </div>
      )}
    </>
  )
}
