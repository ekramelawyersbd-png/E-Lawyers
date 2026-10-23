import { sendApplicationEmail, isEmailJSReady, type ApplicationEmailResult } from './emailService';
import type { CareerApplicationData } from './careerEmailTemplate';

export interface EmailJSResult {
  attempted: boolean;
  success: boolean;
  service: 'emailjs' | 'server-mailer' | 'hybrid';
  message: string;
  error?: string;
}

export function isEmailJSConfigured(): boolean {
  return isEmailJSReady();
}

export async function sendEmailJSCareerNotification(
  data: CareerApplicationData
): Promise<EmailJSResult> {
  const result: ApplicationEmailResult = await sendApplicationEmail(data);
  const isServerFallback = result.text === 'SERVER_MAILER_GATEWAY';
  return {
    attempted: true,
    success: result.success,
    service: isServerFallback ? 'server-mailer' : 'emailjs',
    message: result.message,
    error: result.error
  };
}
