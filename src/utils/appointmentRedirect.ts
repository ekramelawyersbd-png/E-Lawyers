/**
 * Utility for redirecting user inquiries, consultation bookings,
 * and lawyer communication to the centralized Accounticca Appointment Portal.
 * Destination: https://appointment.accounticca.com/
 */

export interface AppointmentRedirectParams {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  lawyer?: string;
  notes?: string;
  message?: string;
  topic?: string;
  date?: string;
  time?: string;
  source?: string;
}

export const APPOINTMENT_BASE_URL = 'https://appointment.accounticca.com/';

/**
 * Builds the destination appointment URL preserving any relevant user-entered information
 * as standard query parameters for seamless prefilling.
 */
export function buildAppointmentUrl(params?: AppointmentRedirectParams): string {
  try {
    const url = new URL(APPOINTMENT_BASE_URL);

    if (!params) {
      return url.toString();
    }

    if (params.name && params.name.trim()) {
      url.searchParams.set('name', params.name.trim());
    }

    if (params.email && params.email.trim()) {
      url.searchParams.set('email', params.email.trim());
    }

    if (params.phone && params.phone.trim()) {
      url.searchParams.set('phone', params.phone.trim());
    }

    if (params.service && params.service.trim()) {
      url.searchParams.set('service', params.service.trim());
    }

    if (params.lawyer && params.lawyer.trim()) {
      url.searchParams.set('lawyer', params.lawyer.trim());
    }

    const notes = params.notes || params.message || params.topic;
    if (notes && notes.trim()) {
      url.searchParams.set('notes', notes.trim());
    }

    if (params.date && params.date.trim()) {
      url.searchParams.set('date', params.date.trim());
    }

    if (params.time && params.time.trim()) {
      url.searchParams.set('time', params.time.trim());
    }

    if (params.source && params.source.trim()) {
      url.searchParams.set('source', params.source.trim());
    }

    return url.toString();
  } catch {
    return APPOINTMENT_BASE_URL;
  }
}

/**
 * Redirects user directly to the designated appointment URL in a new browser tab/window.
 */
export function redirectToAppointment(params?: AppointmentRedirectParams): void {
  const destinationUrl = buildAppointmentUrl(params);
  if (typeof window !== 'undefined') {
    window.open(destinationUrl, '_blank', 'noopener,noreferrer');
  }
}
