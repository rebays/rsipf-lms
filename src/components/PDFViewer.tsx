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
        <div className="card__body">
          <h3 className="card__title">{title}</h3>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '0.375rem' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#e63946" stroke="#c1121f" strokeWidth="0.5"/>
            <path d="M14 2v6h6" fill="none" stroke="#c1121f" strokeWidth="1"/>
            <text x="4.5" y="19" fontFamily="sans-serif" fontWeight="700" fontSize="5.5" fill="#fff" letterSpacing="0.3">PDF</text>
          </svg>
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
