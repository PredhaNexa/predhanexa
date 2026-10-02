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
  // ---------------------------------------------
  // OPTIONS / CORS
  // ---------------------------------------------

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {
      success: true,
    });
  }

  // ---------------------------------------------
  // ONLY POST
  // ---------------------------------------------

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    // ---------------------------------------------
    // SERVER ENVIRONMENT VARIABLES
    // ---------------------------------------------

    const supabaseUrl = process.env.SUPABASE_URL?.trim();

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    const smtpHost =
      process.env.SMTP_HOST?.trim();

    const smtpPort =
      Number(process.env.SMTP_PORT || '587');

    const smtpUsername =
      process.env.SMTP_USERNAME?.trim();

    const smtpPassword =
      process.env.SMTP_PASSWORD?.trim();

    const smtpSecure =
      String(process.env.SMTP_SECURE || 'false')
        .trim()
        .toLowerCase() === 'true';

    const fromEmail =
      process.env.FROM_EMAIL?.trim();

    const contactEmail =
      process.env.CONTACT_EMAIL?.trim();

    const founderEmail =
      process.env.FOUNDER_EMAIL?.trim();

    // ---------------------------------------------
    // ENVIRONMENT VALIDATION
    // ---------------------------------------------

    if (!supabaseUrl) {
      console.error('[Contact] Missing SUPABASE_URL');

      return jsonResponse(500, {
        success: false,
        error: 'Server configuration error: Supabase URL is missing.',
      });
    }

    if (!supabaseServiceRoleKey) {
      console.error('[Contact] Missing SUPABASE_SERVICE_ROLE_KEY');

      return jsonResponse(500, {
        success: false,
        error:
          'Server configuration error: Supabase server key is missing.',
      });
    }

    if (!smtpHost) {
      console.error('[Contact] Missing SMTP_HOST');

      return jsonResponse(500, {
        success: false,
        error: 'Server email configuration is incomplete.',
      });
    }

    if (!smtpUsername || !smtpPassword) {
      console.error('[Contact] Missing SMTP credentials');

      return jsonResponse(500, {
        success: false,
        error: 'Server email configuration is incomplete.',
      });
    }

    if (!fromEmail) {
      console.error('[Contact] Missing FROM_EMAIL');

      return jsonResponse(500, {
        success: false,
        error: 'Server sender email is not configured.',
      });
    }

    if (!contactEmail && !founderEmail) {
      console.error(
        '[Contact] Neither CONTACT_EMAIL nor FOUNDER_EMAIL is configured'
      );

      return jsonResponse(500, {
        success: false,
        error: 'Server recipient email is not configured.',
      });
    }

    // ---------------------------------------------
    // PARSE REQUEST
    // ---------------------------------------------

    let body: Record<string, unknown>;

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return jsonResponse(400, {
        success: false,
        error: 'Invalid JSON request.',
      });
    }

    // ---------------------------------------------
    // READ FORM DATA
    // ---------------------------------------------

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

    // ---------------------------------------------
    // HONEYPOT SPAM PROTECTION
    // ---------------------------------------------

    if (honeypot) {
      return jsonResponse(200, {
        success: true,
        message: 'Message received.',
      });
    }

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

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

    // ---------------------------------------------
    // SUPABASE CLIENT
    // ---------------------------------------------

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

    // ---------------------------------------------
    // SAVE MESSAGE TO SUPABASE
    // ---------------------------------------------

    const finalSubject =
      subject || 'Software Development Inquiry';

    const {
      data: savedMessage,
      error: databaseError,
    } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: finalSubject,
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

    // ---------------------------------------------
    // CREATE SMTP TRANSPORTER
    // ---------------------------------------------

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // ---------------------------------------------
    // VERIFY SMTP CONNECTION
    // ---------------------------------------------

    try {
      await transporter.verify();

      console.info(
        '[Contact] SMTP connection verified successfully'
      );
    } catch (smtpVerifyError) {
      console.error(
        '[Contact] SMTP verification failed:',
        smtpVerifyError
      );

      // IMPORTANT:
      // The enquiry is already safely stored in Supabase.
      // Do not delete it just because email failed.

      return jsonResponse(500, {
        success: false,
        error:
          'Your enquiry was saved, but the notification email could not be sent.',
        id: savedMessage?.id,
      });
    }

    // ---------------------------------------------
    // EMAIL CONTENT
    // ---------------------------------------------

    const emailText = `
New website enquiry received.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Subject: ${finalSubject}

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
  <title>New Website Enquiry</title>
</head>

<body
  style="
    margin:0;
    padding:30px;
    background:#f5f7fa;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:700px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:30px;
    "
  >

    <h2
      style="
        margin-top:0;
        color:#111827;
      "
    >
      New Website Enquiry
    </h2>

    <p style="color:#4b5563;">
      A new project enquiry was submitted through the company website.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:20px 0;
      "
    >

    <table
      style="
        width:100%;
        border-collapse:collapse;
      "
    >

      <tr>
        <td
          style="
            padding:8px 0;
            font-weight:bold;
            width:150px;
          "
        >
          Name
        </td>

        <td style="padding:8px 0;">
          ${name}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:8px 0;
            font-weight:bold;
          "
        >
          Email
        </td>

        <td style="padding:8px 0;">
          <a href="mailto:${email}">
            ${email}
          </a>
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:8px 0;
            font-weight:bold;
          "
        >
          Phone
        </td>

        <td style="padding:8px 0;">
          ${phone || 'Not provided'}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:8px 0;
            font-weight:bold;
          "
        >
          Company
        </td>

        <td style="padding:8px 0;">
          ${company || 'Not provided'}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:8px 0;
            font-weight:bold;
          "
        >
          Subject
        </td>

        <td style="padding:8px 0;">
          ${finalSubject}
        </td>
      </tr>

    </table>

    <hr
      style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:20px 0;
      "
    >

    <h3 style="color:#111827;">
      Message
    </h3>

    <div
      style="
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:8px;
        padding:16px;
        color:#374151;
        white-space:pre-wrap;
      "
    >
      ${message}
    </div>

    <p
      style="
        margin-top:25px;
        font-size:12px;
        color:#9ca3af;
      "
    >
      Database Message ID:
      ${savedMessage?.id || 'N/A'}
    </p>

  </div>

</body>
</html>
`;

    // ---------------------------------------------
    // BUILD RECIPIENT LIST
    // ---------------------------------------------

    const recipients = [
      contactEmail,
      founderEmail,
    ]
      .filter(
        (value): value is string =>
          Boolean(value)
      )
      .filter(
        (value, index, array) =>
          array.indexOf(value) === index
      );

    // ---------------------------------------------
    // SEND EMAIL
    // ---------------------------------------------

    try {
      const mailResult =
        await transporter.sendMail({
          from: `"Website Enquiries" <${fromEmail}>`,
          to: recipients.join(', '),
          replyTo: email,
          subject: `New Website Enquiry: ${finalSubject}`,
          text: emailText,
          html: emailHtml,
        });

      console.info(
        '[Contact] Email sent successfully:',
        mailResult.messageId
      );

    } catch (emailError) {
      console.error(
        '[Contact] Email sending failed:',
        emailError
      );

      // The database record remains safe.
      return jsonResponse(500, {
        success: false,
        error:
          'Your enquiry was saved, but the notification email could not be sent.',
        id: savedMessage?.id,
      });
    }

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    return jsonResponse(200, {
      success: true,
      message:
        'Your enquiry has been successfully submitted.',
      id: savedMessage?.id,
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