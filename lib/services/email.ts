// Email service for sending verification emails
// Uses Resend for email delivery (free tier: 100 emails/day)

import crypto from 'crypto';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface SendVerificationEmailParams {
  to: string;
  contributorName: string;
  locationName: string;
  token: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getTokenExpiration(): Date {
  // Token expires in 24 hours
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

export async function sendVerificationEmail({
  to,
  contributorName,
  locationName,
  token,
}: SendVerificationEmailParams): Promise<EmailResult> {
  const verificationUrl = `${BASE_URL}/api/contributions/verify?token=${token}`;

  // If no API key is set, log the verification URL for development
  if (!RESEND_API_KEY) {
    console.log('='.repeat(60));
    console.log('📧 EMAIL VERIFICATION (Development Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${to}`);
    console.log(`Contributor: ${contributorName}`);
    console.log(`Location: ${locationName}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('='.repeat(60));
    
    return { success: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WanPisuMappu <noreply@wanpisumap.com>',
        to: [to],
        subject: `🏴‍☠️ Verify your contribution: ${locationName}`,
        html: generateEmailHtml(contributorName, locationName, verificationUrl),
        text: generateEmailText(contributorName, locationName, verificationUrl),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function generateEmailHtml(
  contributorName: string, 
  locationName: string, 
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Contribution</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0f; color: #e5e5e5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #2a2a4a;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #ffd700; font-size: 28px; margin: 0;">🏴‍☠️ WanPisuMappu</h1>
      <p style="color: #888; font-size: 14px; margin-top: 5px;">One Piece Lore Map</p>
    </div>
    
    <h2 style="color: #fff; font-size: 22px; margin-bottom: 20px;">
      Ahoy, ${contributorName}! 
    </h2>
    
    <p style="color: #ccc; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Thank you for contributing to the One Piece Lore Map! You've submitted information about 
      <strong style="color: #ffd700;">${locationName}</strong>.
    </p>
    
    <p style="color: #ccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Please verify your email address to complete your contribution:
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${verificationUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%); color: #000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
        ✓ Verify My Contribution
      </a>
    </div>
    
    <p style="color: #888; font-size: 14px; margin-bottom: 20px;">
      This link will expire in 24 hours.
    </p>
    
    <p style="color: #888; font-size: 14px; line-height: 1.6;">
      If you didn't submit a contribution, you can safely ignore this email.
    </p>
    
    <hr style="border: none; border-top: 1px solid #2a2a4a; margin: 30px 0;">
    
    <p style="color: #666; font-size: 12px; text-align: center;">
      Made with ❤️ by the One Piece community
    </p>
    
  </div>
</body>
</html>
  `.trim();
}

function generateEmailText(
  contributorName: string, 
  locationName: string, 
  verificationUrl: string
): string {
  return `
Ahoy, ${contributorName}!

Thank you for contributing to the One Piece Lore Map! You've submitted information about "${locationName}".

Please verify your email address to complete your contribution by visiting:
${verificationUrl}

This link will expire in 24 hours.

If you didn't submit a contribution, you can safely ignore this email.

---
WanPisuMappu - One Piece Lore Map
Made with love by the One Piece community
  `.trim();
}
