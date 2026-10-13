"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAppointmentEmailHtml = generateAppointmentEmailHtml;
exports.generateAppointmentReminderEmailHtml = generateAppointmentReminderEmailHtml;
function generateAppointmentEmailHtml(data) {
    const isConfirmed = data.status === 'Confirmed';
    const isCancelled = data.status === 'Cancelled';
    const statusColor = isConfirmed ? '#059669' : isCancelled ? '#dc2626' : '#d97706';
    const statusBg = isConfirmed ? '#ecfdf5' : isCancelled ? '#fef2f2' : '#fffbeb';
    const statusBorder = isConfirmed ? '#a7f3d0' : isCancelled ? '#fecaca' : '#fde68a';
    const statusTitle = isConfirmed
        ? 'CONSULTATION CONFIRMED'
        : isCancelled
            ? 'APPOINTMENT CANCELLED'
            : 'CONSULTATION PENDING REVIEW';
    const subject = isConfirmed
        ? `[CONFIRMED] Consultation Docket #${data.referenceId} - ELA & Associates Legal Chambers`
        : isCancelled
            ? `[CANCELLED] Consultation Notice #${data.referenceId} - ELA & Associates`
            : `[PENDING] Consultation Booking Received #${data.referenceId} - ELA & Associates`;
    const meetingUrl = data.meetingLink || (data.mode.toLowerCase().includes('virtual')
        ? `https://meet.google.com/ela-${data.referenceId.toLowerCase().replace(/[^a-z0-9]/g, '')}`
        : '');
    const text = `
ELA & ASSOCIATES | ADVOCATES & TAX CONSULTANTS
Official Appointment Status Notice

Reference Docket: ${data.referenceId}
Status: ${data.status.toUpperCase()}
Client Name: ${data.clientName}
Practice Area: ${data.practiceArea}
Mode: ${data.mode === 'virtual' ? 'Virtual (Google Meet)' : 'In-Person (Chamber Suite)'}
Date & Time: ${data.date} at ${data.timeSlot}
${data.companyName ? `Company: ${data.companyName}\n` : ''}
${isCancelled && data.cancellationReason ? `Reason: ${data.cancellationReason}\n` : ''}
${isConfirmed && meetingUrl ? `Google Meet Link: ${meetingUrl}\n` : ''}

Hotline: +880 1712-345678 | Email: chamber@accounticca.com
Chamber Address: Suite 704, Concord Tower, 113 Kazi Nazrul Islam Avenue, Dhaka-1000
  `.trim();
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #091e3a 0%, #102a4c 100%); padding: 32px 36px; text-align: left; border-bottom: 3px solid #d4af37; }
    .brand-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #d4af37; margin: 0 0 6px 0; }
    .brand-title { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.01em; }
    .brand-subtitle { font-size: 12px; color: #94a3b8; margin: 4px 0 0 0; }
    .content { padding: 36px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; background-color: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; margin-bottom: 20px; }
    .headline { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.3; }
    .subtext { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 28px 0; }
    .docket-card { background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 28px; }
    .docket-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 16px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
    .docket-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
    .action-box { background-color: ${isConfirmed ? '#f0fdf4' : '#fff1f2'}; border: 1px solid ${isConfirmed ? '#bbf7d0' : '#fecdd3'}; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .action-title { font-size: 14px; font-weight: 700; color: ${isConfirmed ? '#166534' : '#9f1239'}; margin: 0 0 8px 0; }
    .action-desc { font-size: 13px; color: ${isConfirmed ? '#15803d' : '#881337'}; line-height: 1.5; margin: 0; }
    .btn { display: inline-block; background-color: ${isConfirmed ? '#059669' : '#0f172a'}; color: #ffffff !important; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 14px; text-align: center; }
    .footer { background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center; }
    .footer-divider { margin: 16px 0; border: 0; border-top: 1px solid #e2e8f0; }
    .footer-legal { font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand-eyebrow">Supreme Court & Corporate Tax Practice</div>
      <div class="brand-title">ELA &amp; ASSOCIATES</div>
      <div class="brand-subtitle">Advocates, Corporate Law Consultants &amp; NBR Tax Advisors</div>
    </div>
    <div class="content">
      <div class="status-badge">${statusTitle}</div>
      <h1 class="headline">
        ${isConfirmed
        ? `Consultation Confirmed for ${escapeHtml(data.clientName)}`
        : isCancelled
            ? `Consultation Cancelled (#${escapeHtml(data.referenceId)})`
            : `Booking Received (#${escapeHtml(data.referenceId)})`}
      </h1>
      <p class="subtext">
        ${isConfirmed
        ? `Dear ${escapeHtml(data.clientName)}, your consultation docket has been formally approved and assigned to our practice lead. Please review your session coordinates below.`
        : isCancelled
            ? `Dear ${escapeHtml(data.clientName)}, this is an automated confirmation that your booked consultation docket #${escapeHtml(data.referenceId)} has been marked as cancelled.`
            : `Dear ${escapeHtml(data.clientName)}, your consultation booking request has been registered and is currently under partner chamber review.`}
      </p>

      <div class="docket-card">
        <div class="docket-header">Official Consultation Docket Specifications</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Docket ID:</td>
            <td style="padding: 6px 0; font-weight: 800; font-family: monospace; font-size: 15px; color: #091e3a; text-align: right;">${escapeHtml(data.referenceId)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Practice Area:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${escapeHtml(data.practiceArea)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Consultation Mode:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${data.mode === 'virtual' ? 'Virtual (Google Meet)' : 'In-Person (Chamber Suite)'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Scheduled Date:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${escapeHtml(data.date)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Time Window:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #059669; text-align: right;">${escapeHtml(data.timeSlot)}</td>
          </tr>
          ${data.companyName ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Corporate Entity:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #334155; text-align: right;">${escapeHtml(data.companyName)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Assigned Partner:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #334155; text-align: right;">${escapeHtml(data.assignedLead || 'Adv. Ekram Hossain & Senior Tax Practice Partner')}</td>
          </tr>
        </table>
      </div>

      ${isConfirmed ? `
      <div class="action-box">
        <h3 class="action-title">${data.mode === 'virtual' ? '🎥 Google Meet Room Coordinates' : '🏛 Chamber Arrival Protocol'}</h3>
        <p class="action-desc">
          ${data.mode === 'virtual'
        ? `Your encrypted virtual consultation room is provisioned. Please enter the room 5 minutes prior to your allocated time slot with your microphone and documentation prepared.`
        : `Please arrive at Concord Tower, Suite 704 (Floor 7). Present your Docket ID at the ground-floor visitor desk for express security clearance. Complimentary parking is accessible.`}
        </p>
        ${meetingUrl ? `
        <div style="margin-top: 14px;">
          <a href="${meetingUrl}" target="_blank" class="btn" style="background-color: #059669;">Join Google Meet Consultation</a>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${isCancelled ? `
      <div class="action-box">
        <h3 class="action-title">Cancellation Notice &amp; Re-booking</h3>
        <p class="action-desc">
          ${data.cancellationReason ? `<strong>Reason Noted:</strong> ${escapeHtml(data.cancellationReason)}<br><br>` : ''}
          Your booked slot has been released back to our chamber calendar. If you wish to reschedule or select a different practice area, you may book a new slot at your convenience.
        </p>
        <div style="margin-top: 14px;">
          <a href="https://accounticca.com/contact?tab=book" target="_blank" class="btn" style="background-color: #0f172a;">Book New Consultation Slot</a>
        </div>
      </div>
      ` : ''}

      <div style="font-size: 13px; color: #64748b; line-height: 1.5; border-left: 3px solid #cbd5e1; padding-left: 14px;">
        <strong>Need Assistance or Rescheduling?</strong><br>
        Direct Desk: <strong>+880 1712-345678</strong> | Official Inquiries: <strong>appointments@accounticca.com</strong><br>
        Office Hours: Saturday to Thursday, 9:30 AM – 7:30 PM BST.
      </div>
    </div>

    <div class="footer">
      <div><strong>ELA &amp; ASSOCIATES ADVOCATES &amp; LEGAL CONSULTANTS</strong></div>
      <div style="margin-top: 4px;">Suite 704, Concord Tower, 113 Kazi Nazrul Islam Avenue, Dhaka-1000, Bangladesh</div>
      <div class="footer-divider"></div>
      <div class="footer-legal">
        This automated notification is issued pursuant to statutory chamber booking records on Accounticca Compliance Hub.
        All consultation docket discussions are subject to legal professional privilege and advocate-client confidentiality under the Bangladesh Legal Practitioners and Bar Council Order.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
    return { subject, html, text };
}
/**
 * Generate 24-hour reminder email for upcoming consultations
 */
function generateAppointmentReminderEmailHtml(data) {
    const isVirtual = data.mode.toLowerCase().includes('virtual');
    const meetingUrl = data.meetingLink || (isVirtual
        ? `https://meet.google.com/ela-${data.referenceId.toLowerCase().replace(/[^a-z0-9]/g, '')}`
        : '');
    const subject = `[REMINDER] Upcoming Consultation Within 24 Hours #${data.referenceId} - ELA & Associates Legal Chambers`;
    const text = `
ELA & ASSOCIATES | ADVOCATES & TAX CONSULTANTS
AUTOMATED 24-HOUR CONSULTATION REMINDER

Reference Docket: ${data.referenceId}
Client Name: ${data.clientName}
Practice Area: ${data.practiceArea}
Date: ${data.date}
Time Slot: ${data.timeSlot}
Mode: ${isVirtual ? 'Virtual (Google Meet)' : 'In-Person Chamber Consultation'}
${data.companyName ? `Company: ${data.companyName}\n` : ''}
${isVirtual && meetingUrl ? `Meeting Room Link: ${meetingUrl}\n` : ''}

Pre-Session Guidance:
- Virtual: Please join 5 minutes prior to the session with a stable internet connection.
- In-Person: Arrive at Suite G-5, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka-1205.

Direct Hotline: +880 1335-230170 | +880 1712-345678
Official Support: appointments@accounticca.com
  `.trim();
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #091e3a 0%, #102a4c 100%); padding: 32px 36px; text-align: left; border-bottom: 3px solid #d4af37; }
    .brand-eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #d4af37; margin: 0 0 6px 0; }
    .brand-title { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.01em; }
    .brand-subtitle { font-size: 12px; color: #94a3b8; margin: 4px 0 0 0; }
    .content { padding: 36px; }
    .reminder-badge { display: inline-block; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; background-color: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; margin-bottom: 20px; }
    .headline { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.3; }
    .subtext { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 28px 0; }
    .docket-card { background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 28px; }
    .docket-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 16px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
    .action-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .action-title { font-size: 14px; font-weight: 700; color: #1e40af; margin: 0 0 8px 0; }
    .action-desc { font-size: 13px; color: #1d4ed8; line-height: 1.5; margin: 0; }
    .btn { display: inline-block; background-color: #1d4ed8; color: #ffffff !important; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 14px; text-align: center; }
    .checklist { background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .footer { background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center; }
    .footer-divider { margin: 16px 0; border: 0; border-top: 1px solid #e2e8f0; }
    .footer-legal { font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="brand-eyebrow">Automated Chamber Notification System</div>
      <div class="brand-title">ELA &amp; ASSOCIATES</div>
      <div class="brand-subtitle">Supreme Court Advocates &amp; Chartered Advisory Practice</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="reminder-badge">⏰ UPCOMING IN 24 HOURS</div>

      <h1 class="headline">
        Consultation Reminder: Scheduled for Tomorrow
      </h1>

      <p class="subtext">
        Dear ${escapeHtml(data.clientName)}, this is an automated courtesy reminder that your advisory consultation for <strong>${escapeHtml(data.practiceArea)}</strong> is scheduled to commence within the next 24 hours.
      </p>

      <!-- Docket Card -->
      <div class="docket-card">
        <div class="docket-header">Official Consultation Docket Details</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Docket ID:</td>
            <td style="padding: 6px 0; font-weight: 800; font-family: monospace; font-size: 15px; color: #091e3a; text-align: right;">${escapeHtml(data.referenceId)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Practice Focus:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${escapeHtml(data.practiceArea)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Date:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${escapeHtml(data.date)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Time Slot (BST):</td>
            <td style="padding: 6px 0; font-weight: 700; color: #1d4ed8; text-align: right;">${escapeHtml(data.timeSlot)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Format / Mode:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${isVirtual ? 'Virtual (Google Meet)' : 'In-Person Chamber Suite'}</td>
          </tr>
        </table>
      </div>

      <!-- Action Box -->
      ${isVirtual ? `
      <div class="action-box">
        <h3 class="action-title">🎥 Video Conference Preparation</h3>
        <p class="action-desc">
          Your secure video session room is prepared. Please enter the room 5 minutes prior to the start time with your documents and questions ready.
        </p>
        <div style="margin-top: 14px;">
          <a href="${meetingUrl}" target="_blank" class="btn">Access Google Meet Room</a>
        </div>
      </div>
      ` : `
      <div class="action-box">
        <h3 class="action-title">🏛️ Chamber Reception Protocol</h3>
        <p class="action-desc">
          Please present this notice or Docket ID at Suite G-5 reception, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka-1205.
        </p>
      </div>
      `}

      <!-- Checklist -->
      <div class="checklist">
        <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 6px;">Pre-Consultation Checklist:</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #78350f; line-height: 1.6;">
          <li>Prepare relevant corporate or tax notices, assessments, or contracts.</li>
          <li>Have your list of statutory questions or litigation objectives ready.</li>
          <li>For rescheduling inquiries, notify the chamber at least 4 hours in advance.</li>
        </ul>
      </div>

      <!-- Help info -->
      <div style="font-size: 13px; color: #64748b; line-height: 1.5; border-left: 3px solid #cbd5e1; padding-left: 14px;">
        <strong>Chamber Helpline:</strong> +880 1335-230170 | +880 1712-345678<br>
        <strong>Email:</strong> appointments@accounticca.com
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div><strong>ACCOUNTICCA ADVISORY &amp; E-LAWYERS CHAMBERS</strong></div>
      <div style="margin-top: 4px;">Suite G-5, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka-1205</div>
      <div class="footer-divider"></div>
      <div class="footer-legal">
        This automated 24-hour appointment reminder was generated by the Accounticca Scheduled Firebase Cloud Functions Suite.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
    return { subject, html, text };
}
function escapeHtml(str) {
    if (!str)
        return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
//# sourceMappingURL=emailTemplates.js.map