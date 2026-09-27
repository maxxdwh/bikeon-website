import { Resend } from 'resend';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  'cf-turnstile-response'?: string;
}

export default async function handler(req: any): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: ContactBody;
  const contentType = req.headers['content-type'] || req.headers.get?.('content-type') || '';

  if (contentType.includes('application/json')) {
    body = await req.json();
  } else {
    const formData = await req.formData();
    body = {
      name: formData.get('name') as string | undefined,
      email: formData.get('email') as string | undefined,
      message: formData.get('message') as string | undefined,
      'cf-turnstile-response': formData.get('cf-turnstile-response') as string | undefined,
    };
  }

  const { name, email, message, 'cf-turnstile-response': turnstileToken } = body;

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: 'Spam verification missing' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
    return new Response(JSON.stringify({ error: 'Spam verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY || '');

  try {
    await resend.emails.send({
      from: 'Bike On NZ Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'info@bikeon.org.nz',
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
