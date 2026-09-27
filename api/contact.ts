import { Resend } from 'resend';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  'cf-turnstile-response'?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: ContactBody;
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = JSON.parse(Buffer.concat(chunks).toString());
  } else {
    body = req.body || {};
  }

  const { name, email, message, 'cf-turnstile-response': turnstileToken } = body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (!turnstileToken) {
    res.status(400).json({ error: 'Spam verification missing' });
    return;
  }

  try {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || '',
        response: turnstileToken,
      }),
    });

    const turnstileData = (await turnstileRes.json()) as { success: boolean };
    if (!turnstileData.success) {
      res.status(400).json({ error: 'Spam verification failed' });
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY || '');

    await resend.emails.send({
      from: 'Bike On NZ Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'info@bikeon.org.nz',
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
}
