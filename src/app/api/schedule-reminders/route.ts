import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Registration {
  id: string;
  name: string;
  role: string;
  contact: string;
  comments: string;
  language: string;
  created_at: string;
}

const emailTemplates = {
  nl: {
    subject: "Herinnering: Utrecht Symposium - 15 Oktober 2025",
    getBody: (name: string) => `
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
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">🎓 Utrecht Symposium - Herinnering</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">15 Oktober 2025 - 19:30</p>
          </div>

          <div class="content">
            <p>Beste ${name},</p>

            <p>Dit is een vriendelijke herinnering voor het Utrecht Symposium dat binnenkort plaatsvindt!</p>

            <p><strong>📅 Datum:</strong> Woensdag 15 Oktober 2025<br>
            <strong>🕢 Tijd:</strong> 19:30<br>
            <strong>📍 Locatie:</strong> <a href="https://maps.app.goo.gl/Q4MLGnDBjHxJE2X47" style="color: #fa2a2a;">Willem van Noortcollege, Utrecht</a></p>

            <p>We kijken ernaar uit u te verwelkomen bij dit belangrijke evenement!</p>

            <p>Met vriendelijke groet,<br>
            Het Utrecht Symposium Team</p>
          </div>

          <div class="footer">
            <p>Dit is een automatisch gegenereerd bericht</p>
          </div>
        </body>
      </html>
    `,
  },
  en: {
    subject: "Reminder: Utrecht Symposium - October 15, 2025",
    getBody: (name: string) => `
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
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">🎓 Utrecht Symposium - Reminder</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">October 15, 2025 - 7:30 PM</p>
          </div>

          <div class="content">
            <p>Dear ${name},</p>

            <p>This is a friendly reminder about the Utrecht Symposium coming up soon!</p>

            <p><strong>📅 Date:</strong> Wednesday, October 15, 2025<br>
            <strong>🕢 Time:</strong> 7:30 PM<br>
            <strong>📍 Location:</strong> <a href="https://maps.app.goo.gl/Q4MLGnDBjHxJE2X47" style="color: #fa2a2a;">Willem van Noortcollege, Utrecht</a></p>

            <p>We look forward to welcoming you to this important event!</p>

            <p>Best regards,<br>
            The Utrecht Symposium Team</p>
          </div>

          <div class="footer">
            <p>This is an automatically generated message</p>
          </div>
        </body>
      </html>
    `,
  },
  ar: {
    subject: "تذكير: ندوة أوتريخت - 15 أكتوبر 2025",
    getBody: (name: string) => `
      <!DOCTYPE html>
      <html dir="rtl">
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
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">🎓 ندوة أوتريخت - تذكير</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">15 أكتوبر 2025 - 7:30 مساءً</p>
          </div>

          <div class="content">
            <p>عزيزي/عزيزتي ${name}،</p>

            <p>هذا تذكير ودي بشأن ندوة أوتريخت القادمة قريباً!</p>

            <p><strong>📅 التاريخ:</strong> الأربعاء 15 أكتوبر 2025<br>
            <strong>🕢 الوقت:</strong> 7:30 مساءً<br>
            <strong>📍 الموقع:</strong> <a href="https://maps.app.goo.gl/Q4MLGnDBjHxJE2X47" style="color: #fa2a2a;">كلية ويليم فان نورت، أوتريخت</a></p>

            <p>نتطلع إلى الترحيب بك في هذا الحدث المهم!</p>

            <p>مع أطيب التحيات،<br>
            فريق ندوة أوتريخت</p>
          </div>

          <div class="footer">
            <p>هذه رسالة مُنشأة تلقائياً</p>
          </div>
        </body>
      </html>
    `,
  },
  tr: {
    subject: "Hatırlatma: Utrecht Sempozyumu - 15 Ekim 2025",
    getBody: (name: string) => `
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
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #888;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">🎓 Utrecht Sempozyumu - Hatırlatma</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">15 Ekim 2025 - 19:30</p>
          </div>

          <div class="content">
            <p>Sayın ${name},</p>

            <p>Bu, yakında düzenlenecek Utrecht Sempozyumu için dostça bir hatırlatmadır!</p>

            <p><strong>📅 Tarih:</strong> Çarşamba, 15 Ekim 2025<br>
            <strong>🕢 Saat:</strong> 19:30<br>
            <strong>📍 Konum:</strong> <a href="https://maps.app.goo.gl/Q4MLGnDBjHxJE2X47" style="color: #fa2a2a;">Willem van Noortcollege, Utrecht</a></p>

            <p>Sizi bu önemli etkinlikte ağırlamayı sabırsızlıkla bekliyoruz!</p>

            <p>Saygılarımızla,<br>
            Utrecht Sempozyum Ekibi</p>
          </div>

          <div class="footer">
            <p>Bu otomatik olarak oluşturulmuş bir mesajdır</p>
          </div>
        </body>
      </html>
    `,
  },
};

// October 7, 2025 at 6:30 PM Netherlands time (CEST = UTC+2) - TEST
const TEST_DATE = "2025-10-07T16:30:00.000Z";
// October 8, 2025 at 12:00 PM Netherlands time (CEST = UTC+2)
const REMINDER_1_DATE = "2025-10-08T10:00:00.000Z";
// October 14, 2025 at 12:00 PM Netherlands time (CEST = UTC+2)
const REMINDER_2_DATE = "2025-10-14T10:00:00.000Z";

// Test recipients
const TEST_RECIPIENTS = ["hadi.m.alachkar@gmail.com", "jetdidi@hotmail.com"];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { reminderDate } = body; // "test", "reminder1" or "reminder2"

    // Create Supabase client for server-side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all registrations
    const { data: registrations, error: dbError } = await supabase
      .from("symposium_registrations")
      .select("*");

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      );
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No registrations found",
        scheduled: 0,
      });
    }

    // Filter for test recipients if this is a test
    let recipientList = registrations as Registration[];
    if (reminderDate === "test") {
      recipientList = recipientList.filter((r) =>
        TEST_RECIPIENTS.includes(r.contact)
      );
    }

    const scheduledAt =
      reminderDate === "test"
        ? TEST_DATE
        : reminderDate === "reminder2"
        ? REMINDER_2_DATE
        : REMINDER_1_DATE;

    console.log(
      `Scheduling reminder emails for ${recipientList.length} registrants at ${scheduledAt}...`
    );

    const results = {
      scheduled: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Schedule reminder email for each registrant
    for (const registration of recipientList) {
      try {
        const language = registration.language || "nl";
        const template =
          emailTemplates[language as keyof typeof emailTemplates] ||
          emailTemplates.nl;

        const { error: emailError } = await resend.emails.send({
          from: process.env.FROM_EMAIL || "Symposium <noreply@resend.dev>",
          to: registration.contact,
          subject: template.subject,
          html: template.getBody(registration.name),
          scheduledAt: scheduledAt,
        });

        if (emailError) {
          console.error(
            `Failed to schedule for ${registration.contact}:`,
            emailError
          );
          results.failed++;
          results.errors.push(
            `${registration.contact}: ${emailError.message || "Unknown error"}`
          );
        } else {
          console.log(`Reminder scheduled for ${registration.contact}`);
          results.scheduled++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error scheduling for ${registration.contact}:`, error);
        results.failed++;
        results.errors.push(
          `${registration.contact}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    console.log(
      `Scheduling complete: ${results.scheduled} scheduled, ${results.failed} failed`
    );

    return NextResponse.json({
      success: true,
      scheduled: results.scheduled,
      failed: results.failed,
      total: registrations.length,
      scheduledAt: scheduledAt,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error("Error in schedule-reminders:", error);
    return NextResponse.json(
      { error: "Failed to schedule reminder emails" },
      { status: 500 }
    );
  }
}
