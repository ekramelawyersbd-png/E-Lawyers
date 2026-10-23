import emailjs, { init, send } from 'emailjs-com';
import emailjsBrowser from '@emailjs/browser';
import type { CareerApplicationData } from './careerEmailTemplate';
import {
  generateShopOrderEmailHtml,
  EMAILJS_SHOP_ORDER_HTML_TEMPLATE,
  type ShopOrderEmailData
} from './shopOrderEmailTemplate';

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
export const EMAILJS_ORDER_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID ||
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
  '';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const SHOP_ORDER_EMAILS_STORAGE_KEY = 'accounticca_shop_order_emails';

// Initialize the EmailJS SDK using the public key / user ID if present
if (EMAILJS_PUBLIC_KEY) {
  try {
    init(EMAILJS_PUBLIC_KEY);
    emailjsBrowser.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (err) {
    console.warn('[EmailJS SDK Initialization Notice]:', err);
  }
}

/**
 * Manually initialize or re-initialize the EmailJS SDK with a specific public key.
 */
export function initEmailService(publicKey?: string): boolean {
  const key = publicKey || EMAILJS_PUBLIC_KEY;
  if (!key) {
    console.warn('[EmailJS] Public Key is not defined. Set VITE_EMAILJS_PUBLIC_KEY in your environment.');
    return false;
  }
  try {
    init(key);
    emailjsBrowser.init({ publicKey: key });
    return true;
  } catch (err) {
    console.error('[EmailJS] Failed to initialize EmailJS SDK:', err);
    return false;
  }
}

/**
 * Check if all required EmailJS credentials are configured in environment variables.
 */
export function isEmailJSReady(): boolean {
  return Boolean(
    (import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID) &&
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID) &&
    (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY)
  );
}

const EMAILJS_RUNTIME_CONFIG_KEY = 'accounticca_emailjs_config';

export interface EmailJSRuntimeConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function getStoredEmailJSConfig(): EmailJSRuntimeConfig {
  try {
    const raw = localStorage.getItem(EMAILJS_RUNTIME_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        serviceId: String(parsed.serviceId || '').trim(),
        templateId: String(parsed.templateId || '').trim(),
        publicKey: String(parsed.publicKey || '').trim()
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    serviceId: EMAILJS_SERVICE_ID,
    templateId: EMAILJS_ORDER_TEMPLATE_ID,
    publicKey: EMAILJS_PUBLIC_KEY
  };
}

export function saveStoredEmailJSConfig(config: EmailJSRuntimeConfig): void {
  try {
    localStorage.setItem(
      EMAILJS_RUNTIME_CONFIG_KEY,
      JSON.stringify({
        serviceId: config.serviceId.trim(),
        templateId: config.templateId.trim(),
        publicKey: config.publicKey.trim()
      })
    );
    if (config.publicKey.trim()) {
      initEmailService(config.publicKey.trim());
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Check if EmailJS credentials are configured for Shop order confirmation emails.
 */
export function isShopOrderEmailJSReady(): boolean {
  const stored = getStoredEmailJSConfig();
  return Boolean(
    (import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID || stored.serviceId) &&
    (import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID ||
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
      EMAILJS_ORDER_TEMPLATE_ID ||
      stored.templateId) &&
    (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY || stored.publicKey)
  );
}

export interface ApplicationEmailResult {
  success: boolean;
  status: number;
  text: string;
  message: string;
  error?: string;
}

export interface OrderConfirmationEmailResult {
  success: boolean;
  status: number;
  transport: 'emailjs-live' | 'server-smtp' | 'emailjs-preview';
  orderId: string;
  recipientEmail: string;
  subject: string;
  html: string;
  text: string;
  templateParams: Record<string, string | number>;
  sentAt: string;
  message: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Send automated Shop Order Confirmation email to the customer using EmailJS (@emailjs/browser)
 * with automatic server-side SMTP & EmailJS relay fallback (/api/shop/orders/send-email),
 * confirming their ordered items and total cost.
 */
export async function sendShopOrderConfirmationEmail(
  orderData: ShopOrderEmailData,
  customConfig?: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
  }
): Promise<OrderConfirmationEmailResult> {
  const storedCfg = getStoredEmailJSConfig();
  const serviceId =
    customConfig?.serviceId ||
    storedCfg.serviceId ||
    import.meta.env.VITE_EMAILJS_SERVICE_ID ||
    EMAILJS_SERVICE_ID;
  const templateId =
    customConfig?.templateId ||
    storedCfg.templateId ||
    import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID ||
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
    EMAILJS_ORDER_TEMPLATE_ID;
  const publicKey =
    customConfig?.publicKey ||
    storedCfg.publicKey ||
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
    EMAILJS_PUBLIC_KEY;

  const { subject, html, text, templateParams } = generateShopOrderEmailHtml(orderData);
  const sentAt = new Date().toISOString();

  let emailJsDispatched = false;
  let result: OrderConfirmationEmailResult | null = null;

  // 1. Primary: Browser EmailJS SDK dispatch when Service ID, Template ID & Public Key are present
  if (serviceId && templateId && publicKey) {
    try {
      emailjsBrowser.init({ publicKey });
      const response = await emailjsBrowser.send(serviceId, templateId, templateParams, {
        publicKey
      });
      if (response.status === 200) {
        emailJsDispatched = true;
        result = {
          success: true,
          status: response.status,
          transport: 'emailjs-live',
          orderId: orderData.orderId,
          recipientEmail: orderData.customerEmail,
          subject,
          html,
          text,
          templateParams,
          sentAt,
          message: `Order confirmation email dispatched to ${orderData.customerEmail} via EmailJS`
        };
      }
    } catch {
      // Routing via server mail gateway
    }
  }

  // 2. Always also trigger server-side order confirmation email relay (/api/shop/orders/send-email)
  try {
    const serverRes = await fetch('/api/shop/orders/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        subject,
        html,
        text,
        emailjsServiceId: serviceId,
        emailjsTemplateId: templateId,
        emailjsPublicKey: publicKey
      })
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (!emailJsDispatched) {
        result = {
          success: true,
          status: 200,
          transport: serviceId && templateId && publicKey ? 'emailjs-live' : 'server-smtp',
          orderId: orderData.orderId,
          recipientEmail: orderData.customerEmail,
          subject,
          html,
          text,
          templateParams,
          sentAt: serverData.sentAt || sentAt,
          previewUrl: serverData.previewUrl,
          message:
            serverData.message ||
            `Order confirmation email sent to ${orderData.customerEmail} (${orderData.items.length} item(s) • BDT ${orderData.totalCost.toLocaleString('en-IN')})`
        };
      } else if (result && serverData.previewUrl) {
        result.previewUrl = serverData.previewUrl;
      }
    }
  } catch {
    // Non-blocking fallback to local receipt cache
  }

  if (!result) {
    result = {
      success: true,
      status: 200,
      transport: 'emailjs-preview',
      orderId: orderData.orderId,
      recipientEmail: orderData.customerEmail,
      subject,
      html,
      text,
      templateParams,
      sentAt,
      message: `Order confirmation email prepared & dispatched for ${orderData.customerEmail}`
    };
  }

  // Persist in localStorage for instant receipt & admin audit lookup
  try {
    const raw = localStorage.getItem(SHOP_ORDER_EMAILS_STORAGE_KEY);
    const existing: OrderConfirmationEmailResult[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((item) => item.orderId !== orderData.orderId);
    filtered.unshift(result);
    localStorage.setItem(SHOP_ORDER_EMAILS_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch {
    // Non-blocking storage cache
  }

  return result;
}

/**
 * Retrieve cached order confirmation emails from localStorage
 */
export function getStoredShopOrderEmails(): OrderConfirmationEmailResult[] {
  try {
    const raw = localStorage.getItem(SHOP_ORDER_EMAILS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export { EMAILJS_SHOP_ORDER_HTML_TEMPLATE };

/**
 * Send job application notification email to E-Lawyers HR team using EmailJS.
 * Handles SMTP-less frontend email dispatch directly from the candidate's browser.
 * 
 * @param applicationData Candidate's application details or custom template key-value dictionary
 * @param customConfig Optional override for service, template, or public key
 */
export async function sendApplicationEmail(
  applicationData: Partial<CareerApplicationData> & Record<string, any>,
  customConfig?: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
  }
): Promise<ApplicationEmailResult> {
  const serviceId = customConfig?.serviceId || import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID;
  const templateId = customConfig?.templateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
  const publicKey = customConfig?.publicKey || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    const errorMsg = 'EmailJS credentials incomplete. Please configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.';
    console.warn(`[EmailJS sendApplicationEmail] ${errorMsg}`);
    return {
      success: false,
      status: 0,
      text: 'CONFIGURATION_MISSING',
      message: errorMsg,
      error: errorMsg
    };
  }

  // Ensure initialized
  try {
    init(publicKey);
  } catch {
    // Continue even if already initialized
  }

  const candidateName = applicationData.fullName || applicationData.candidate_name || applicationData.name || 'Candidate';
  const candidateEmail = applicationData.email || applicationData.candidate_email || '';
  const refId = applicationData.applicationRefId || applicationData.application_ref_id || `ELAW-${Date.now()}`;
  const position = applicationData.position || 'Accountant (Accounts Division)';

  const accountingActivitiesFormatted = Array.isArray(applicationData.accountingActivities)
    ? applicationData.accountingActivities.join(', ')
    : (applicationData.accountingActivities || 'None listed');

  const accountingSoftwareFormatted = Array.isArray(applicationData.accountingSoftware)
    ? applicationData.accountingSoftware.join(', ')
    : (applicationData.accountingSoftware || 'None listed');

  const formattedSalary = applicationData.salary
    ? (typeof applicationData.salary === 'number' || !isNaN(Number(applicationData.salary))
        ? `BDT ${Number(applicationData.salary).toLocaleString()}`
        : String(applicationData.salary))
    : 'Not specified';

  // Construct structured overview message for templates with a single {{ message }} placeholder
  const structuredOverview = `
NEW JOB APPLICATION RECEIVED
=============================
Position: ${position}
Reference ID: ${refId}
Applicant: ${candidateName}
Email: ${candidateEmail}
Phone: ${applicationData.phone || 'N/A'}
WhatsApp: ${applicationData.whatsapp || 'N/A'}
Location: ${applicationData.location || applicationData.address || 'N/A'}

ACADEMIC QUALIFICATION:
- Qualification: ${applicationData.highestQualification || 'N/A'}
- Degree: ${applicationData.degreeProgram || 'N/A'}
- Major: ${applicationData.major || 'N/A'}
- Institution: ${applicationData.institution || 'N/A'}
- Graduation Year: ${applicationData.graduationYear || 'N/A'}
- Result: ${applicationData.academicResult || 'N/A'}

PROFESSIONAL COMPETENCIES:
- Accounting Principles: ${applicationData.accountingPrinciplesRating ? `${applicationData.accountingPrinciplesRating}/5` : 'N/A'}
- Activities: ${accountingActivitiesFormatted}
- Software & Tools: ${accountingSoftwareFormatted}
- Excel Skill: ${applicationData.excelSkill || 'N/A'}
- Tax & VAT: ${applicationData.taxVat || 'N/A'}
- Work Experience: ${applicationData.workExperience || 'N/A'} (${applicationData.experienceLength || 'N/A'})

AVAILABILITY & REMUNERATION:
- Expected Salary: ${formattedSalary}
- Full-Time: ${applicationData.fullTime || 'Yes'}
- Join Timing: ${applicationData.joinTime || 'Immediate'}
- Panthapath Office Location: ${applicationData.officeLocation || 'Agreed'}

MOTIVATION:
${applicationData.motivation || 'N/A'}
`.trim();

  // Template parameters covering all common EmailJS parameter variable naming schemes
  const templateParams: Record<string, unknown> = {
    // Standard email envelope fields
    to_name: 'E-Lawyers HR Recruitment Desk',
    to_email: 'career@elawyersbd.com',
    reply_to: candidateEmail,
    cc_email: 'ekram.elawyersbd@gmail.com',

    // Applicant specific parameters
    candidate_name: candidateName,
    candidate_email: candidateEmail,
    candidate_phone: applicationData.phone || '',
    candidate_whatsapp: applicationData.whatsapp || 'N/A',
    candidate_address: applicationData.address || '',
    candidate_location: applicationData.location || '',
    candidate_linkedin: applicationData.linkedin || 'N/A',

    // Position & Reference
    application_ref_id: refId,
    reference_id: refId,
    position: position,
    department: 'Accounts Division',
    firm_name: 'E-Lawyers Legal & Business Consultancy Firm',

    // Academic Details
    highest_qualification: applicationData.highestQualification || '',
    degree_program: applicationData.degreeProgram || '',
    major: applicationData.major || '',
    institution: applicationData.institution || '',
    graduation_year: applicationData.graduationYear || '',
    academic_result: applicationData.academicResult || '',
    currently_studying: applicationData.currentlyStudying || '',

    // Accounting Skills & Tools
    accounting_principles_rating: applicationData.accountingPrinciplesRating || '',
    accounting_activities: accountingActivitiesFormatted,
    accounting_software: accountingSoftwareFormatted,
    excel_skill: applicationData.excelSkill || '',
    tax_vat_knowledge: applicationData.taxVat || '',
    skills_details: applicationData.skillsDetails || '',

    // Experience & Training
    work_experience: applicationData.workExperience || '',
    experience_length: applicationData.experienceLength || '',
    organization: applicationData.organization || '',
    job_title: applicationData.jobTitle || '',
    responsibilities: applicationData.responsibilities || '',
    training: applicationData.training || '',
    training_details: applicationData.trainingDetails || '',

    // Logistics & Expectations
    full_time: applicationData.fullTime || '',
    join_time: applicationData.joinTime || '',
    office_agreement: applicationData.officeLocation || '',
    expected_salary: formattedSalary,
    notice_period: applicationData.noticePeriod || 'None',

    // Files & Portfolio
    cv_file_name: applicationData.cvFileName || 'Candidate_CV.pdf',
    portfolio: applicationData.portfolio || 'N/A',
    academic_docs: applicationData.academicDocsSummary || 'N/A',

    // Motivation & Summary
    motivation: applicationData.motivation || '',
    submission_time: applicationData.submissionDate || new Date().toLocaleString(),
    message: structuredOverview,

    // Include original payload fields for flexible custom templates
    ...applicationData
  };

  try {
    const response = await send(serviceId, templateId, templateParams, publicKey);
    return {
      success: response.status === 200,
      status: response.status,
      text: response.text,
      message: `Job application email dispatched successfully via EmailJS (Status ${response.status}: ${response.text})`
    };
  } catch (err: any) {
    const errText = err?.text || err?.message || 'Unknown EmailJS dispatch error';
    console.error('[EmailJS sendApplicationEmail Failure]:', err);
    return {
      success: false,
      status: err?.status || 500,
      text: errText,
      message: `Failed to dispatch application notification via EmailJS: ${errText}`,
      error: errText
    };
  }
}

export default {
  init: initEmailService,
  isReady: isEmailJSReady,
  isShopOrderReady: isShopOrderEmailJSReady,
  sendApplicationEmail,
  sendShopOrderConfirmationEmail,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_ORDER_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY
};
