import nodemailer from "nodemailer";
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve __dirname first so we can point dotenv at an explicit, unambiguous
// path instead of trusting the current working directory (which changes
// depending on where `npm run dev` was invoked from).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), '.env');
const envResult = dotenv.config({
  path: envPath,
  override: true,
});
if (envResult.error) {
  console.error(`[dotenv] Could not load .env at ${envPath}:`, envResult.error.message);
} else {
  console.info(`[dotenv] Loaded environment from ${envPath}`);
}

// Trim to guard against trailing \r, spaces, or newlines that Windows editors
// sometimes leave in .env values (this alone is a common cause of EAUTH).
const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = Number(process.env.SMTP_PORT?.trim() || 587);
const SMTP_SECURE = process.env.SMTP_SECURE?.trim() === 'true';
const SMTP_USERNAME = process.env.SMTP_USERNAME?.trim();
const SMTP_PASSWORD = process.env.SMTP_PASSWORD?.trim();

// Safe diagnostics: never log the password itself, only whether it exists.
console.info('[SMTP CONFIG]', {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER: SMTP_USERNAME,
  SMTP_PASSWORD_SET: Boolean(SMTP_PASSWORD),
});

if (!SMTP_USERNAME || !SMTP_PASSWORD) {
  console.error(
    '[SMTP CONFIG] SMTP_USERNAME or SMTP_PASSWORD is missing. ' +
    'Check that .env sits next to server.ts (not named .env.txt), that it is ' +
    'the only .env file being loaded, and that the value is not empty or quoted oddly.'
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE, // true = port 465, false = port 587 (STARTTLS)
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

// Verify the SMTP connection/credentials once at startup so a bad App
// Password shows up in the terminal immediately instead of on first form submit.
transporter.verify((err) => {
  if (err) {
    console.error('[SMTP] Verification failed:', err.message);
  } else {
    console.info('[SMTP] Server is ready to send messages.');
  }
});

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory messages store for API inquiries
const inboundMessages: Array<{
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  receivedAt: string;
}> = [];

// Basic HTML-escape helper so user input can't inject markup into the email
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Contact form API endpoint
app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, company, subject, message, honeypot } = req.body;

  // Spam protection
  if (honeypot) {
    res.json({ success: true, message: 'Message received.' });
    return;
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'Name is required.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: 'Valid email address is required.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ error: 'Message must be at least 5 characters long.' });
    return;
  }

  const messageRecord = {
    id: 'msg_' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? String(phone).trim() : undefined,
    company: company ? String(company).trim() : undefined,
    subject: subject ? String(subject).trim() : 'Software Development Inquiry',
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  inboundMessages.push(messageRecord);

  const recipient = process.env.CONTACT_EMAIL?.trim() || 'predhanexa@gmail.com';
  const founderEmail = process.env.FOUNDER_EMAIL?.trim() || 'naragantiumadevi@gmail.com';

  console.info(
    `[Contact Inbound] New message recorded: ${messageRecord.id} from ${messageRecord.email}`
  );

  if (!SMTP_USERNAME || !SMTP_PASSWORD) {
    console.error(`[SMTP] Cannot send ${messageRecord.id}: SMTP credentials are not configured.`);
    res.status(500).json({
      success: false,
      error: 'Your inquiry was received, but email delivery is not configured on the server.',
      id: messageRecord.id,
    });
    return;
  }

  try {
    const safeName = escapeHtml(messageRecord.name);
    const safeEmail = escapeHtml(messageRecord.email);
    const safePhone = escapeHtml(messageRecord.phone || 'Not provided');
    const safeCompany = escapeHtml(messageRecord.company || 'Not provided');
    const safeSubject = escapeHtml(messageRecord.subject);
    const safeMessage = escapeHtml(messageRecord.message).replace(/\n/g, '<br>');

    await transporter.sendMail({
      from: `"Predhanexa Website" <${SMTP_USERNAME}>`,
      to: [recipient, founderEmail],
      replyTo: messageRecord.email,
      subject: `New Project Inquiry: ${messageRecord.subject}`,

      text: `
New Project Inquiry

Name: ${messageRecord.name}
Email: ${messageRecord.email}
Phone: ${messageRecord.phone || 'Not provided'}
Company: ${messageRecord.company || 'Not provided'}
Subject: ${messageRecord.subject}

Message:
${messageRecord.message}
      `,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Project Inquiry</h2>

          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>

          <h3>Message</h3>
          <p>${safeMessage}</p>

          <hr>

          <p>This message was submitted through the Predhanexa website.</p>
        </div>
      `,
    });

    console.info(`[SMTP] Email sent successfully: ${messageRecord.id}`);

    res.json({
      success: true,
      message: 'Your inquiry has been sent successfully.',
      id: messageRecord.id,
    });

  } catch (error) {
    console.error('[SMTP] Email sending failed:', error);

    res.status(500).json({
      success: false,
      error: 'Your inquiry was received, but the notification email could not be sent.',
      id: messageRecord.id,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Predhanexa Enterprise Backend',
  });
});

// Express route for robots.txt
app.get('/robots.txt', (_req: Request, res: Response): void => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://predhanexa.com/sitemap.xml
`);
});

// Express route for sitemap.xml
app.get('/sitemap.xml', (_req: Request, res: Response): void => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://predhanexa.com/</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/about</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/services</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/team</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/contact</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/privacy-policy</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://predhanexa.com/terms</loc>
    <lastmod>2026-09-26</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`);
});

// Vite Middleware integration for development
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Predhanexa Enterprise Server running on port ${PORT}`);
  });
}

startServer();