import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('email service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('generateVerificationToken', () => {
    it('generates a 64 character hex string', async () => {
      const { generateVerificationToken } = await import('@/lib/services/email');
      const token = generateVerificationToken();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64);
    });
  });

  describe('getTokenExpiration', () => {
    it('returns a date 24 hours in the future', async () => {
      const { getTokenExpiration } = await import('@/lib/services/email');
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
      
      const exp = getTokenExpiration();
      expect(exp.toISOString()).toBe('2023-01-02T00:00:00.000Z');
      
      vi.useRealTimers();
    });
  });

  describe('sendVerificationEmail', () => {
    const params = {
      to: 'test@example.com',
      contributorName: 'Zoro',
      locationName: 'Wano',
      token: 'abc123token',
    };

    it('logs to console and returns success in development mode (no API key)', async () => {
      vi.stubEnv('RESEND_API_KEY', '');
      const { sendVerificationEmail } = await import('@/lib/services/email');
      
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const result = await sendVerificationEmail(params);
      
      expect(result.success).toBe(true);
      expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('EMAIL VERIFICATION'));
      expect(global.fetch).not.toHaveBeenCalled();
      
      consoleLog.mockRestore();
    });

    it('sends email via Resend API when API key is present', async () => {
      vi.stubEnv('RESEND_API_KEY', 're_test_123');
      const { sendVerificationEmail } = await import('@/lib/services/email');
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'email_123' })
      } as any);

      const result = await sendVerificationEmail(params);
      
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('returns error when API response is not ok', async () => {
      vi.stubEnv('RESEND_API_KEY', 're_test_123');
      const { sendVerificationEmail } = await import('@/lib/services/email');
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid API key' })
      } as any);
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await sendVerificationEmail(params);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
      
      consoleError.mockRestore();
    });

    it('returns error when network fails', async () => {
      vi.stubEnv('RESEND_API_KEY', 're_test_123');
      const { sendVerificationEmail } = await import('@/lib/services/email');
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await sendVerificationEmail(params);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      
      consoleError.mockRestore();
    });
  });
});
