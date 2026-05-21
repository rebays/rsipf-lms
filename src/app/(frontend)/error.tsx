'use client'

export default function FrontendError({ error, reset }: { error: Error; reset: () => void }) {
  const isDbError =
    /connection refused|cannot connect|ECONN|ETIMEDOUT|database/i.test(error?.message ?? '')

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-bold text-[#0a1f3a]">
        {isDbError ? 'Service temporarily unavailable' : 'Something went wrong'}
      </h1>
      <p className="text-gray-600 max-w-md">
        {isDbError
          ? 'The system is unable to connect to the database right now. Please try again in a moment.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <button onClick={reset} className="btn btn--gold">
        Try again
      </button>
    </div>
  )
}
