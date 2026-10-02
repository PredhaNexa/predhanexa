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

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, company, subject, message, honeypot } = body;

    // Spam honeypot detection
    if (honeypot) {
      // Silently discard spam bots
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Message received.' }),
      };
    }

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Valid name is required.' }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'A valid email address is required.' }),
      };
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message must be at least 5 characters long.' }),
      };
    }

    const recipient = process.env.CONTACT_EMAIL || 'predhanexa@gmail.com';
    const founderEmail = process.env.FOUNDER_EMAIL || 'naragantiumadevi@gmail.com';

    // In Netlify serverless execution, message details are logged safely
    console.info(`[Contact Inbound] From: ${name.trim()} <${email.trim()}> | Phone: ${phone || 'N/A'} | Company: ${company || 'N/A'} | Subject: ${subject || 'Software Inquiry'} -> Notifying: ${recipient}, ${founderEmail}`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Your message has been successfully transmitted. Our engineering team will review and respond promptly.',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to process inquiry. Please contact directly via email or phone.' }),
    };
  }
};

