import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const { user, payload } = await getCurrentUser()
  if (!user) return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })

  const { quizId, answers } = (await req.json()) as {
    quizId: string
    answers: Record<string, number>
  }

  const quiz = await payload.findByID({
    collection: 'quizzes',
    id: quizId,
    overrideAccess: true,
  })

  let earned = 0
  let possible = 0
  const recordedAnswers: { questionIndex: number; selectedOption: number }[] = []

  ;(quiz.questions || []).forEach((q: any, idx: number) => {
    const points = q.points || 1
    possible += points
    const picked = answers?.[idx]
    if (typeof picked === 'number') {
      recordedAnswers.push({ questionIndex: idx, selectedOption: picked })
      if (picked === q.correctAnswer) earned += points
    }
  })

  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0
  const passed = score >= (quiz.passMark || 70)

  await payload.create({
    collection: 'attempts',
    data: {
      officer: user.id,
      quiz: quizId,
      answers: recordedAnswers,
      score,
      passed,
      takenAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  return NextResponse.json({ score, passed })
}
