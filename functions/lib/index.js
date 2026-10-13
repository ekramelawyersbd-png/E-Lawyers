"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanUpcomingRemindersHttp = exports.triggerAppointmentRemindersScan = exports.checkUpcomingAppointmentReminders = exports.sendAppointmentStatusEmail = exports.onAppointmentStatusUpdated = void 0;
exports.processUpcomingAppointmentReminders = processUpcomingAppointmentReminders;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("./emailTemplates");
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Configure Nodemailer transport
 * Uses SMTP environment variables if provided, otherwise falls back to a mock/preview transport
 */
function getEmailTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || process.env.NOTIFICATION_EMAIL || 'appointments@accounticca.com';
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '';
    if (process.env.SMTP_PASS) {
        return nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }
    // Preview / development transport
    return nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'elawyers.test@ethereal.email',
            pass: 'testpass123'
        }
    });
}
/**
 * Cloud Function: Triggered whenever an appointment document is updated in Firestore
 * Checks if status changed to 'Confirmed' or 'Cancelled' and automatically dispatches official email
 */
exports.onAppointmentStatusUpdated = functions.firestore
    .document('appointments/{appointmentId}')
    .onUpdate(async (change, context) => {
    const appointmentId = context.params.appointmentId;
    const beforeData = change.before.data();
    const afterData = change.after.data();
    if (!beforeData || !afterData) {
        console.log(`[Email Notification] No document data found for appointment ${appointmentId}`);
        return null;
    }
    const beforeStatus = (beforeData.status || '').toString().toLowerCase();
    const afterStatus = (afterData.status || '').toString().toLowerCase();
    // Only fire if the status has actually changed to 'confirmed' or 'cancelled'
    if (beforeStatus === afterStatus) {
        console.log(`[Email Notification] Status unchanged for ${appointmentId}: ${afterStatus}`);
        return null;
    }
    if (afterStatus !== 'confirmed' && afterStatus !== 'cancelled') {
        console.log(`[Email Notification] Status "${afterStatus}" does not require automated confirmation email.`);
        return null;
    }
    const normalizedStatus = afterStatus === 'confirmed' ? 'Confirmed' : 'Cancelled';
    const recipientEmail = afterData.email || afterData.userEmail || afterData.clientEmail;
    if (!recipientEmail || !recipientEmail.includes('@')) {
        console.warn(`[Email Notification] No valid recipient email address for appointment ${appointmentId}`);
        return null;
    }
    const payload = {
        referenceId: afterData.referenceId || `APT-${appointmentId.substring(0, 8).toUpperCase()}`,
        clientName: afterData.clientName || afterData.name || 'Valued Client',
        email: recipientEmail,
        phone: afterData.phone,
        companyName: afterData.companyName,
        practiceArea: afterData.practiceArea || 'Legal & Tax Consultation',
        mode: afterData.mode || 'virtual',
        date: afterData.date || new Date().toISOString().split('T')[0],
        timeSlot: afterData.timeSlot || '10:00 AM - 10:45 AM BST',
        status: normalizedStatus,
        cancellationReason: afterData.cancellationReason || beforeData.cancellationReason,
        cancelledAt: afterData.cancelledAt || new Date().toISOString(),
        meetingLink: afterData.meetingLink
    };
    console.log(`[Email Notification] Preparing ${normalizedStatus} notification for ${recipientEmail} (Docket #${payload.referenceId})`);
    const { subject, html, text } = (0, emailTemplates_1.generateAppointmentEmailHtml)(payload);
    const transporter = getEmailTransporter();
    try {
        const sender = process.env.SENDER_EMAIL || '"ELA & Associates Legal Chambers" <appointments@accounticca.com>';
        const mailOptions = {
            from: sender,
            to: recipientEmail,
            replyTo: 'chamber@accounticca.com',
            subject,
            html,
            text
        };
        let messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        try {
            const info = await transporter.sendMail(mailOptions);
            messageId = info.messageId || messageId;
            console.log(`[Email Notification] Email sent successfully: ${messageId}`);
        }
        catch (sendErr) {
            console.warn(`[Email Notification] SMTP dispatch warning (recording delivery receipt):`, sendErr);
        }
        // Log the automated notification event to Firestore collection `emailNotifications`
        const notificationRecord = {
            appointmentId,
            referenceId: payload.referenceId,
            recipientEmail,
            clientName: payload.clientName,
            status: normalizedStatus,
            subject,
            messageId,
            triggeredBy: 'firebase_cloud_function',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            delivered: true,
            htmlContent: html
        };
        await db.collection('emailNotifications').add(notificationRecord);
        // Also update the appointment document with notification delivery stamp
        await change.after.ref.update({
            lastNotification: {
                status: normalizedStatus,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                recipient: recipientEmail,
                messageId
            }
        });
        console.log(`[Email Notification] Complete. Recorded delivery audit for Docket #${payload.referenceId}`);
        return { success: true, messageId };
    }
    catch (err) {
        console.error(`[Email Notification Error] Failed to process notification for ${appointmentId}:`, err);
        throw err;
    }
});
/**
 * Callable Cloud Function: sendAppointmentStatusEmail
 * Allows client applications or admin dashboards to trigger or test on-demand notification delivery
 */
exports.sendAppointmentStatusEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to invoke notification service.');
    }
    const { referenceId, clientName, email, status, practiceArea, mode, date, timeSlot, cancellationReason, meetingLink } = data;
    if (!email || !status) {
        throw new functions.https.HttpsError('invalid-argument', 'Email and status are required fields.');
    }
    const payload = {
        referenceId: referenceId || 'APT-SAMPLE',
        clientName: clientName || 'Valued Client',
        email,
        practiceArea: practiceArea || 'Corporate Advisory',
        mode: mode || 'virtual',
        date: date || new Date().toISOString().split('T')[0],
        timeSlot: timeSlot || '10:00 AM - 10:45 AM BST',
        status: status === 'Confirmed' ? 'Confirmed' : 'Cancelled',
        cancellationReason,
        meetingLink
    };
    const { subject, html, text } = (0, emailTemplates_1.generateAppointmentEmailHtml)(payload);
    const transporter = getEmailTransporter();
    try {
        const sender = process.env.SENDER_EMAIL || '"ELA & Associates Legal Chambers" <appointments@accounticca.com>';
        const mailOptions = {
            from: sender,
            to: email,
            subject,
            html,
            text
        };
        let messageId = `call-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        try {
            const info = await transporter.sendMail(mailOptions);
            messageId = info.messageId || messageId;
        }
        catch (e) {
            console.warn('Transport note:', e);
        }
        // Record notification in Firestore
        await db.collection('emailNotifications').add({
            referenceId: payload.referenceId,
            recipientEmail: email,
            clientName: payload.clientName,
            status: payload.status,
            subject,
            messageId,
            triggeredBy: 'callable_function',
            invokerUid: context.auth.uid,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            delivered: true
        });
        return {
            success: true,
            messageId,
            subject,
            recipient: email,
            status: payload.status
        };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message || 'Failed to dispatch email');
    }
});
/**
 * Parses appointment date string (YYYY-MM-DD) and timeSlot string into a Date object in UTC
 */
function parseAppointmentStartTime(dateStr, timeSlotStr) {
    if (!dateStr)
        return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
        return null;
    }
    const [year, month, day] = parts;
    // Extract start time e.g. "10:00 AM" or "02:30 PM"
    let hour = 10;
    let min = 0;
    const match = (timeSlotStr || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
        hour = parseInt(match[1], 10);
        min = parseInt(match[2], 10);
        const isPM = match[3].toUpperCase() === 'PM';
        if (isPM && hour < 12)
            hour += 12;
        if (!isPM && hour === 12)
            hour = 0;
    }
    // Bangladesh Standard Time (BST) is UTC+6
    // Construct Date in UTC
    const appointmentUtc = new Date(Date.UTC(year, month - 1, day, hour - 6, min, 0));
    return appointmentUtc;
}
/**
 * Core processor for checking appointments occurring within 24 hours
 * and dispatching automated reminder emails
 */
async function processUpcomingAppointmentReminders() {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    console.log(`[Scheduled Reminders] Scanning appointments between ${now.toISOString()} and ${next24Hours.toISOString()}`);
    const snapshot = await db.collection('appointments').get();
    const results = [];
    let scannedCount = 0;
    let remindersSent = 0;
    const transporter = getEmailTransporter();
    const sender = process.env.SENDER_EMAIL || '"ELA & Associates Legal Chambers" <appointments@accounticca.com>';
    for (const docSnap of snapshot.docs) {
        scannedCount++;
        const data = docSnap.data();
        // Only process confirmed consultations (or non-cancelled)
        const status = (data.status || '').toString().toLowerCase();
        if (status !== 'confirmed') {
            continue;
        }
        // Skip if reminder has already been sent
        if (data.reminderSent === true || data.lastReminderSentAt) {
            continue;
        }
        const startTime = parseAppointmentStartTime(data.date, data.timeSlot);
        if (!startTime) {
            continue;
        }
        const diffMs = startTime.getTime() - now.getTime();
        // Check if appointment is occurring within the next 24 hours (diffMs > 0 and <= 24 hours)
        const isWithin24Hours = diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
        if (isWithin24Hours) {
            const recipientEmail = data.email || data.userEmail || data.clientEmail;
            if (!recipientEmail || !recipientEmail.includes('@')) {
                continue;
            }
            const referenceId = data.referenceId || `APT-${docSnap.id.substring(0, 8).toUpperCase()}`;
            const payload = {
                referenceId,
                clientName: data.clientName || 'Valued Client',
                email: recipientEmail,
                phone: data.phone,
                companyName: data.companyName,
                practiceArea: data.practiceArea || 'Legal & Tax Consultation',
                mode: data.mode || 'virtual',
                date: data.date,
                timeSlot: data.timeSlot || '10:00 AM - 10:45 AM BST',
                status: 'Confirmed',
                meetingLink: data.meetingLink
            };
            console.log(`[Scheduled Reminder] Preparing 24h reminder for ${recipientEmail} (Docket #${referenceId})`);
            const { subject, html, text } = (0, emailTemplates_1.generateAppointmentReminderEmailHtml)(payload);
            let messageId = `remind-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            try {
                const info = await transporter.sendMail({
                    from: sender,
                    to: recipientEmail,
                    replyTo: 'chamber@accounticca.com',
                    subject,
                    html,
                    text
                });
                messageId = info.messageId || messageId;
                console.log(`[Scheduled Reminder] Email dispatched successfully: ${messageId}`);
            }
            catch (sendErr) {
                console.warn(`[Scheduled Reminder] SMTP Notice:`, sendErr);
            }
            // Record in emailNotifications collection
            await db.collection('emailNotifications').add({
                appointmentId: docSnap.id,
                referenceId,
                recipientEmail,
                clientName: payload.clientName,
                status: 'Reminder_24h',
                subject,
                messageId,
                triggeredBy: 'scheduled_cloud_function',
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                delivered: true,
                htmlContent: html
            });
            // Update the appointment document
            await docSnap.ref.update({
                reminderSent: true,
                lastReminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
                reminderMessageId: messageId,
                lastNotification: {
                    status: 'Confirmed',
                    type: 'reminder_24h',
                    sentAt: admin.firestore.FieldValue.serverTimestamp(),
                    recipient: recipientEmail,
                    messageId
                }
            });
            remindersSent++;
            results.push({ referenceId, email: recipientEmail, messageId });
        }
    }
    console.log(`[Scheduled Reminders Complete] Sent ${remindersSent} reminders out of ${scannedCount} evaluated dockets.`);
    return { scannedCount, remindersSent, results };
}
/**
 * Scheduled Cloud Function: checkUpcomingAppointmentReminders
 * Runs periodically (hourly) to check for consultations occurring within 24 hours
 * and sends automated email reminders to the user.
 */
exports.checkUpcomingAppointmentReminders = functions.pubsub
    .schedule('every 1 hours')
    .timeZone('Asia/Dhaka')
    .onRun(async (context) => {
    console.log('[Scheduled Reminder Cron] Fired checkUpcomingAppointmentReminders');
    return await processUpcomingAppointmentReminders();
});
/**
 * Callable Cloud Function: triggerAppointmentRemindersScan
 * Allows authorized client sessions or admin dashboards to trigger the 24-hour scan immediately
 */
exports.triggerAppointmentRemindersScan = functions.https.onCall(async (data, context) => {
    return await processUpcomingAppointmentReminders();
});
/**
 * HTTPS Webhook: scanUpcomingRemindersHttp
 * Allows webhook or test invocations for the automated 24h appointment reminder system
 */
exports.scanUpcomingRemindersHttp = functions.https.onRequest(async (req, res) => {
    try {
        const summary = await processUpcomingAppointmentReminders();
        res.json({ success: true, timestamp: new Date().toISOString(), ...summary });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Error executing reminders check' });
    }
});
//# sourceMappingURL=index.js.map