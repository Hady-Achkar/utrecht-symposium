import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const roleLabels: Record<string, string> = {
  parent: "Ouder / Parent",
  policyMaker: "Beleidsmaker / Policy Maker",
  expert: "Expert",
  school: "Vanuit school / School Staff",
  other: "Anders (student) / Other (student)",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, contact, comments, language } = body

    console.log("Processing registration:", {
      name,
      role,
      contact,
      language,
    })

    // Send email notification
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.FROM_EMAIL || "Symposium <noreply@resend.dev>",
          to: [process.env.NOTIFICATION_EMAIL],
          subject: `Nieuwe Symposium Registratie - ${name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background-color: #673ab7;
                    color: white;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    margin: -20px -20px 20px -20px;
                  }
                  .content {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                  }
                  .field {
                    margin-bottom: 15px;
                    padding: 10px;
                    background: white;
                    border-radius: 4px;
                  }
                  .label {
                    font-weight: bold;
                    color: #673ab7;
                    margin-bottom: 5px;
                  }
                  .value {
                    color: #555;
                  }
                  .footer {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #888;
                    font-size: 12px;
                  }
                  .language-badge {
                    display: inline-block;
                    background: #673ab7;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2 style="margin: 0;">🎓 Nieuwe Symposium Registratie</h2>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Utrecht Symposium - 15 Oktober 19:30</p>
                </div>

                <div class="content">
                  <div class="field">
                    <div class="label">👤 Naam</div>
                    <div class="value">${name}</div>
                  </div>

                  <div class="field">
                    <div class="label">🏷️ Rol</div>
                    <div class="value">${roleLabels[role] || role}</div>
                  </div>

                  <div class="field">
                    <div class="label">📧 Contact</div>
                    <div class="value">${contact}</div>
                  </div>

                  <div class="field">
                    <div class="label">💬 Opmerkingen</div>
                    <div class="value">${comments || "Geen opmerkingen"}</div>
                  </div>

                  <div class="field">
                    <div class="label">🌍 Taal</div>
                    <div class="value">
                      <span class="language-badge">${language.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <p>📅 Registratie ontvangen op ${new Date().toLocaleString('nl-NL')}</p>
                  <p>Dit is een automatisch gegenereerd bericht</p>
                </div>
              </body>
            </html>
          `,
        })

        if (error) {
          console.error("Resend error:", error)
          // Don't throw error - let the registration continue even if email fails
        } else {
          console.log("Email sent successfully:", data)
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Don't throw error - let the registration continue even if email fails
      }
    } else {
      console.log("Email skipped - missing RESEND_API_KEY or NOTIFICATION_EMAIL")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing notification:", error)
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 }
    )
  }
}