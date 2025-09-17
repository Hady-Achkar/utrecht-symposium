import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    console.log("Testing email configuration...")
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
    console.log("NOTIFICATION_EMAIL:", process.env.NOTIFICATION_EMAIL)

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: "RESEND_API_KEY is not configured",
        hint: "Please add RESEND_API_KEY to your .env.local file"
      }, { status: 400 })
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      return NextResponse.json({
        error: "NOTIFICATION_EMAIL is not configured",
        hint: "Please add NOTIFICATION_EMAIL to your .env.local file"
      }, { status: 400 })
    }

    // Send test email
    const { data, error } = await resend.emails.send({
      from: "Symposium Test <noreply@resend.dev>",
      to: [process.env.NOTIFICATION_EMAIL],
      subject: "Test Email - Symposium Registration System",
      html: `
        <h2>Test Email Successful!</h2>
        <p>This is a test email from your Symposium Registration system.</p>
        <p>If you're seeing this, email notifications are working correctly.</p>
        <hr>
        <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
      `,
    })

    if (error) {
      console.error("Resend error details:", error)
      return NextResponse.json({
        error: "Failed to send email",
        details: error,
        hint: "Check if your Resend API key is valid and has permissions"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: data?.id,
      sentTo: process.env.NOTIFICATION_EMAIL
    })

  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({
      error: "Unexpected error occurred",
      details: String(error)
    }, { status: 500 })
  }
}