import { createTransport } from "nodemailer"

export const smtpTransportGmail = createTransport({
  service: "Gmail",
  auth: { user: "jonathan@idealguides.com", pass: process.env.GMAIL_PASSWORD },
})
