import emailjs, { init, send } from 'emailjs-com';
import type { CareerApplicationData } from './careerEmailTemplate';

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize the EmailJS SDK using the public key / user ID if present
if (EMAILJS_PUBLIC_KEY) {
  try {
    init(EMAILJS_PUBLIC_KEY);
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

export interface ApplicationEmailResult {
  success: boolean;
  status: number;
  text: string;
  message: string;
  error?: string;
}

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
  sendApplicationEmail,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY
};
