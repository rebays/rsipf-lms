'use client'

import styles from './global-error.module.css'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <h1 className={styles.title}>Service temporarily unavailable</h1>
        <p className={styles.text}>
          The system cannot reach the database. Please try again in a moment.
        </p>
        <button onClick={reset} className={styles.btn}>
          Try again
        </button>
      </body>
    </html>
  )
}
