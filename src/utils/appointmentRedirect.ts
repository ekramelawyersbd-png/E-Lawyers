/**
 * Utility for redirecting user inquiries, consultation bookings,
 * and lawyer communication to the centralized Accounticca contact & inquiry desk.
 * Destination: /contact
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

export const APPOINTMENT_BASE_URL = '/contact';

/**
 * Builds the destination contact/appointment URL preserving any relevant user-entered information
 * as standard query parameters for seamless prefilling.
 */
export function buildAppointmentUrl(params?: AppointmentRedirectParams): string {
  try {
    const searchParams = new URLSearchParams();

    if (!params) {
      return APPOINTMENT_BASE_URL;
    }

    if (params.name && params.name.trim()) {
      searchParams.set('name', params.name.trim());
    }

    if (params.email && params.email.trim()) {
      searchParams.set('email', params.email.trim());
    }

    if (params.phone && params.phone.trim()) {
      searchParams.set('phone', params.phone.trim());
    }

    if (params.service && params.service.trim()) {
      searchParams.set('service', params.service.trim());
    }

    if (params.lawyer && params.lawyer.trim()) {
      searchParams.set('lawyer', params.lawyer.trim());
    }

    const notes = params.notes || params.message || params.topic;
    if (notes && notes.trim()) {
      searchParams.set('notes', notes.trim());
    }

    if (params.date && params.date.trim()) {
      searchParams.set('date', params.date.trim());
    }

    if (params.time && params.time.trim()) {
      searchParams.set('time', params.time.trim());
    }

    if (params.source && params.source.trim()) {
      searchParams.set('source', params.source.trim());
    }

    const query = searchParams.toString();
    return query ? `${APPOINTMENT_BASE_URL}?${query}` : APPOINTMENT_BASE_URL;
  } catch {
    return APPOINTMENT_BASE_URL;
  }
}

/**
 * Redirects user directly to the designated contact/appointment route.
 */
export function redirectToAppointment(params?: AppointmentRedirectParams): void {
  const destinationUrl = buildAppointmentUrl(params);
  if (typeof window !== 'undefined') {
    window.location.href = destinationUrl;
  }
}

