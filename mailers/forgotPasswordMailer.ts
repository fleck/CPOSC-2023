/* The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */
import { smtpTransportGmail } from "integrations/email"
import previewEmail from "preview-email"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/user/reset-password?token=${token}`

  const msg = {
    from: "jonathan@idealguides.com",
    to,
    subject: "Your Password Reset Instructions",
    html: `
      <h1>Reset Your Password</h1>

      <a href="${resetUrl}">
        Click here to set a new password
      </a>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        await smtpTransportGmail.sendMail(msg)
      } else {
        // Preview email in the browser
        await previewEmail(msg)
      }
    },
  }
}
