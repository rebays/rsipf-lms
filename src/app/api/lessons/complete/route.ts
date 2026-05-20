import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const { user, payload } = await getCurrentUser()
  if (!user) return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })

  const { lessonId, courseId } = await req.json()
  if (!lessonId || !courseId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const modules = await payload.find({
    collection: 'modules',
    where: { course: { equals: courseId } },
    limit: 100,
    overrideAccess: true,
  })
  const moduleIds = modules.docs.map((m) => m.id)
  const lessons = moduleIds.length
    ? await payload.find({
        collection: 'lessons',
        where: { module: { in: moduleIds } },
        limit: 500,
        overrideAccess: true,
      })
    : { docs: [] }
  const totalLessons = lessons.docs.length || 1

  const existing = await payload.find({
    collection: 'progress',
    where: {
      and: [{ officer: { equals: user.id } }, { course: { equals: courseId } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  const existingCompleted = (existing.docs[0]?.completedLessons || []).map((cl: any) =>
    typeof cl.lesson === 'object' ? cl.lesson.id : cl.lesson,
  )
  const completedSet = new Set([...existingCompleted, lessonId])
  const completedArr = Array.from(completedSet).map((id) => ({ lesson: id }))
  const percentage = Math.min(
    100,
    Math.round((completedSet.size / totalLessons) * 100),
  )

  let progressDoc
  if (existing.docs[0]) {
    progressDoc = await payload.update({
      collection: 'progress',
      id: existing.docs[0].id,
      data: {
        completedLessons: completedArr,
        percentageComplete: percentage,
      },
      overrideAccess: true,
    })
  } else {
    progressDoc = await payload.create({
      collection: 'progress',
      data: {
        officer: user.id,
        course: courseId,
        completedLessons: completedArr,
        percentageComplete: percentage,
      },
      overrideAccess: true,
    })
  }

  return NextResponse.json({
    ok: true,
    percentageComplete: progressDoc.percentageComplete,
  })
}
