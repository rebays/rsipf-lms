'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '4rem 1rem' }}>
        <h1 style={{ color: '#0a1f3a', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Service temporarily unavailable
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          The system cannot reach the database. Please try again in a moment.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#8c7232',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
