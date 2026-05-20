import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const from = process.env.RESEND_FROM_EMAIL || 'no-reply@rsipf.local'
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const resend = apiKey ? new Resend(apiKey) : null

const send = async (params: { to: string; subject: string; html: string }) => {
  if (!resend) {
    console.log(`[email:dev] to=${params.to} subject="${params.subject}"`)
    return
  }
  await resend.emails.send({ from, ...params })
}

export const sendCourseAssignedEmail = async (args: {
  to: string
  officerName: string
  courseTitle: string
  courseSlug: string
}) => {
  const url = `${serverUrl}/courses/${args.courseSlug}`
  await send({
    to: args.to,
    subject: `New training assigned: ${args.courseTitle}`,
    html: `
      <p>Hello ${args.officerName},</p>
      <p>A new course is now available for you on the RSIPF Learning Portal:</p>
      <p><strong>${args.courseTitle}</strong></p>
      <p><a href="${url}">Open course</a></p>
      <p>Thank you for your continued service.</p>
    `,
  })
}

export const sendCertificateIssuedEmail = async (args: {
  to: string
  officerName: string
  courseTitle: string
  certificateNumber: string
}) => {
  const url = `${serverUrl}/certificates`
  await send({
    to: args.to,
    subject: `Certificate issued: ${args.courseTitle}`,
    html: `
      <p>Congratulations ${args.officerName},</p>
      <p>You have completed <strong>${args.courseTitle}</strong>. Your certificate is ready.</p>
      <p>Certificate number: <strong>${args.certificateNumber}</strong></p>
      <p><a href="${url}">Download your certificate</a></p>
    `,
  })
}

export const sendQuizFailedEmail = async (args: {
  to: string
  officerName: string
  quizTitle: string
  score: number
}) => {
  await send({
    to: args.to,
    subject: `Quiz result: ${args.quizTitle}`,
    html: `
      <p>Hello ${args.officerName},</p>
      <p>You scored ${args.score}% on <strong>${args.quizTitle}</strong>, which did not meet the pass mark.</p>
      <p>Please review the lesson and try again — you can retake the quiz when ready.</p>
      <p><a href="${serverUrl}/dashboard">Return to your dashboard</a></p>
    `,
  })
}
