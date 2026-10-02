import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

const jsonResponse = (
  statusCode: number,
  data: Record<string, unknown>
): NetlifyResponse => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(data),
  };
};

export const handler = async (
  event: NetlifyEvent
): Promise<NetlifyResponse> => {
  // Handle browser preflight
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {
      success: true,
    });
  }

  // Only POST is allowed
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    /*
     * ============================================================
     * ENVIRONMENT VARIABLES
     * ============================================================
     */

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const smtpHost =
      process.env.SMTP_HOST || 'smtp.gmail.com';

    const smtpPort = Number(
      process.env.SMTP_PORT || '587'
    );

    const smtpUsername =
      process.env.SMTP_USERNAME;

    const smtpPassword =
      process.env.SMTP_PASSWORD;

    const fromEmail =
      process.env.FROM_EMAIL ||
      smtpUsername;

    const contactEmail =
      process.env.CONTACT_EMAIL ||
      'predhanexa@gmail.com';

    const founderEmail =
      process.env.FOUNDER_EMAIL ||
      'naragantiumadevi@gmail.com';

    /*
     * ============================================================
     * ENVIRONMENT VALIDATION
     * ============================================================
     */

    if (!supabaseUrl) {
      console.error(
        '[Contact] Missing SUPABASE_URL'
      );

      return jsonResponse(500, {
        success: false,
        error: 'Server configuration error: SUPABASE_URL is missing.',
      });
    }

    if (!supabaseServiceRoleKey) {
      console.error(
        '[Contact] Missing SUPABASE_SERVICE_ROLE_KEY'
      );

      return jsonResponse(500, {
        success: false,
        error:
          'Server configuration error: Supabase server key is missing.',
      });
    }

    if (!smtpUsername || !smtpPassword) {
      console.error(
        '[Contact] SMTP credentials are missing'
      );

      return jsonResponse(500, {
        success: false,
        error:
          'Server email configuration is incomplete.',
      });
    }

    /*
     * ============================================================
     * PARSE REQUEST
     * ============================================================
     */

    let body: Record<string, unknown>;

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return jsonResponse(400, {
        success: false,
        error: 'Invalid JSON request.',
      });
    }

    const name =
      typeof body.name === 'string'
        ? body.name.trim()
        : '';

    const email =
      typeof body.email === 'string'
        ? body.email.trim()
        : '';

    const phone =
      typeof body.phone === 'string'
        ? body.phone.trim()
        : '';

    const company =
      typeof body.company === 'string'
        ? body.company.trim()
        : '';

    const subject =
      typeof body.subject === 'string'
        ? body.subject.trim()
        : '';

    const message =
      typeof body.message === 'string'
        ? body.message.trim()
        : '';

    const honeypot =
      typeof body.honeypot === 'string'
        ? body.honeypot.trim()
        : '';

    /*
     * ============================================================
     * HONEYPOT SPAM PROTECTION
     * ============================================================
     */

    if (honeypot) {
      return jsonResponse(200, {
        success: true,
        message: 'Message received.',
      });
    }

    /*
     * ============================================================
     * VALIDATION
     * ============================================================
     */

    if (!name) {
      return jsonResponse(400, {
        success: false,
        error: 'Valid name is required.',
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return jsonResponse(400, {
        success: false,
        error: 'A valid email address is required.',
      });
    }

    if (!message || message.length < 5) {
      return jsonResponse(400, {
        success: false,
        error:
          'Message must be at least 5 characters long.',
      });
    }

    /*
     * ============================================================
     * SUPABASE CLIENT
     *
     * SERVICE ROLE KEY MUST NEVER BE USED IN FRONTEND CODE.
     * It is safe here because this is a Netlify server function.
     * ============================================================
     */

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * ============================================================
     * SAVE CONTACT MESSAGE TO SUPABASE
     * ============================================================
     */

    const { data: savedMessage, error: databaseError } =
      await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          phone: phone || null,
          company: company || null,
          subject:
            subject || 'Software Development Inquiry',
          message,
          is_read: false,
        })
        .select()
        .single();

    if (databaseError) {
      console.error(
        '[Contact] Supabase insert failed:',
        databaseError
      );

      return jsonResponse(500, {
        success: false,
        error:
          'Your inquiry could not be saved. Please try again.',
      });
    }

    console.info(
      '[Contact] Message saved successfully:',
      savedMessage?.id
    );

    /*
     * ============================================================
     * CREATE SMTP TRANSPORTER
     * ============================================================
     */

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure:
        String(process.env.SMTP_SECURE).toLowerCase() ===
        'true',
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    /*
     * ============================================================
     * EMAIL CONTENT
     * ============================================================
     */

    const emailSubject =
      subject || 'New Software Development Inquiry';

    const emailText = `
New enquiry received from Predhanexa website.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Subject: ${emailSubject}

Message:
${message}

Database Message ID:
${savedMessage?.id || 'N/A'}
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Predhanexa Enquiry</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:30px;">

  <div style="
    max-width:700px;
    margin:auto;
    background:white;
    border-radius:12px;
    padding:30px;
    border:1px solid #e5e7eb;
  ">

    <h2 style="margin-top:0;color:#111827;">
      New Website Enquiry
    </h2>

    <p style="color:#4b5563;">
      A new project enquiry was submitted through the Predhanexa website.
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">

    <table style="width:100%;border-collapse:collapse;">

      <tr>
        <td style="padding:8px 0;font-weight:bold;width:140px;">
          Name
        </td>
        <td style="padding:8px 0;">
          ${name}
        </td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:bold;">
          Email
        </td>
        <td style="padding:8px 0;">
          <a href="mailto:${email}">
            ${email}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:bold;">
          Phone
        </td>
        <td style="padding:8px 0;">
          ${phone || 'Not provided'}
        </td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:bold;">
          Company
        </td>
        <td style="padding:8px 0;">
          ${company || 'Not provided'}
        </td>
      </tr>

      <tr>
        <td style="padding:8px 0;font-weight:bold;">
          Subject
        </td>
        <td style="padding:8px 0;">
          ${emailSubject}
        </td>
      </tr>

    </table>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">

    <h3 style="color:#111827;">
      Project Details
    </h3>

    <div style="
      background:#f9fafb;
      padding:16px;
      border-radius:8px;
      white-space:pre-wrap;
      color:#374151;
    ">
${message}
    </div>

    <p style="
      margin-top:25px;
      color:#9ca3af;
      font-size:12px;
    ">
      Supabase message ID: ${savedMessage?.id || 'N/A'}
    </p>

  </div>

</body>
</html>
`;

    /*
     * ============================================================
     * SEND EMAIL
     * ============================================================
     */

    try {
      await transporter.sendMail({
        from: `"Predhanexa Website" <${fromEmail}>`,
        to: contactEmail,
        cc: founderEmail || undefined,
        replyTo: email,
        subject: `New Website Enquiry: ${emailSubject}`,
        text: emailText,
        html: emailHtml,
      });

      console.info(
        '[Contact] Notification email sent successfully.'
      );
    } catch (emailError) {
      /*
       * IMPORTANT:
       * The enquiry is already safely stored in Supabase.
       * Therefore an email failure should NOT delete the enquiry.
       */

      console.error(
        '[Contact] Email sending failed:',
        emailError
      );

      return jsonResponse(500, {
        success: false,
        error:
          'Your enquiry was saved, but the notification email could not be sent. Please contact us directly.',
      });
    }

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return jsonResponse(200, {
      success: true,
      message:
        'Your enquiry has been received successfully.',
      id: savedMessage?.id || null,
    });
  } catch (error) {
    console.error(
      '[Contact] Unexpected server error:',
      error
    );

    return jsonResponse(500, {
      success: false,
      error:
        'Failed to process your enquiry. Please try again later.',
    });
  }
};