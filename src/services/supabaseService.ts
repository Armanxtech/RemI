import { supabase, SUPABASE_URL } from './supabaseClient';
import {
  MedicalAppointment,
  CaregiverBooking,
  SignUpFormData,
  LabReport,
} from '../types';

export interface SupabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'supabase_direct' | 'server_proxy' | 'local_fallback';
}

/**
 * Helper to save Sign Up form data into Supabase
 */
export async function saveSignUpToSupabase(
  formData: SignUpFormData
): Promise<SupabaseResponse<any>> {
  const payload = {
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    role: formData.role,
    age: formData.age,
    gender: formData.gender,
    location: formData.location,
    state: formData.state,
    pincode: formData.pincode,
    blood_group: formData.bloodGroup,
    primary_caregiver_name: formData.primaryCaregiverName,
    primary_caregiver_phone: formData.primaryCaregiverPhone,
    primary_caregiver_relationship: formData.primaryCaregiverRelationship,
    preferred_language: formData.preferredLanguage,
    medical_conditions: formData.medicalConditions || '',
    created_at: new Date().toISOString(),
  };

  // 1. Save locally for instant offline cache
  try {
    const existingSignups = JSON.parse(
      localStorage.getItem('cognicare_signups') || '[]'
    );
    localStorage.setItem(
      'cognicare_signups',
      JSON.stringify([payload, ...existingSignups])
    );
  } catch (e) {
    console.warn('Local storage error:', e);
  }

  // 2. Direct Supabase Client Attempt
  try {
    const { data, error } = await supabase
      .from('signups')
      .insert([payload])
      .select();

    if (!error) {
      console.log('✅ Successfully inserted signup into Supabase "signups" table:', data);
      return { success: true, data, source: 'supabase_direct' };
    } else {
      console.warn('Direct Supabase insert error on "signups", trying server proxy:', error.message);
    }
  } catch (err) {
    console.warn('Direct Supabase call failed:', err);
  }

  // 3. Fallback to Server Proxy route
  try {
    const res = await fetch('/api/supabase/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const resData = await res.json();
      return { success: true, data: resData, source: 'server_proxy' };
    }
  } catch (proxyErr) {
    console.warn('Server proxy signup error:', proxyErr);
  }

  return {
    success: true,
    data: payload,
    source: 'local_fallback',
  };
}

/**
 * Helper to save Appointment form data into Supabase
 */
export async function saveAppointmentToSupabase(
  appointment: Partial<MedicalAppointment>
): Promise<SupabaseResponse<MedicalAppointment>> {
  const newId = appointment.id || `apt_${Date.now()}`;
  const record = {
    id: newId,
    patient_id: appointment.patientId || 'pat_arpan_001',
    patient_name: appointment.patientName || 'Arpan Das',
    doctor_name: appointment.doctorName,
    specialty: appointment.specialty,
    hospital: appointment.hospital,
    date_time: appointment.dateTime,
    time_slot: appointment.timeSlot || '10:00 AM',
    consultation_type: appointment.consultationType || 'hospital_visit',
    symptoms: appointment.symptoms || '',
    phone: appointment.phone || '',
    email: appointment.email || '',
    status: appointment.status || 'confirmed',
    notes: appointment.notes || '',
    created_at: new Date().toISOString(),
  };

  // Local cache
  try {
    const existing = JSON.parse(
      localStorage.getItem('cognicare_appointments') || '[]'
    );
    const updated = [
      {
        ...appointment,
        id: newId,
        createdAt: record.created_at,
      },
      ...existing,
    ];
    localStorage.setItem('cognicare_appointments', JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage appointment error:', e);
  }

  // Direct Supabase insert
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([record])
      .select();

    if (!error) {
      console.log('✅ Successfully inserted appointment into Supabase:', data);
      return {
        success: true,
        data: {
          id: newId,
          patientName: record.patient_name,
          doctorName: record.doctor_name || '',
          specialty: record.specialty || '',
          hospital: record.hospital || '',
          dateTime: record.date_time || '',
          timeSlot: record.time_slot,
          consultationType: record.consultation_type as any,
          symptoms: record.symptoms,
          phone: record.phone,
          status: 'confirmed',
          notes: record.notes,
          createdAt: record.created_at,
        },
        source: 'supabase_direct',
      };
    } else {
      console.warn('Supabase appointments insert error:', error.message);
    }
  } catch (err) {
    console.warn('Direct appointments call exception:', err);
  }

  // Server proxy fallback
  try {
    const res = await fetch('/api/supabase/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (res.ok) {
      const resData = await res.json();
      return { success: true, data: resData.data, source: 'server_proxy' };
    }
  } catch (proxyErr) {
    console.warn('Server proxy appointment error:', proxyErr);
  }

  return {
    success: true,
    data: {
      id: newId,
      patientName: record.patient_name,
      doctorName: record.doctor_name || '',
      specialty: record.specialty || '',
      hospital: record.hospital || '',
      dateTime: record.date_time || '',
      timeSlot: record.time_slot,
      consultationType: record.consultation_type as any,
      symptoms: record.symptoms,
      phone: record.phone,
      status: 'confirmed',
      notes: record.notes,
      createdAt: record.created_at,
    },
    source: 'local_fallback',
  };
}

/**
 * Fetch all appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<MedicalAppointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id || `apt_${d.id}`,
        patientId: d.patient_id,
        patientName: d.patient_name || 'Patient',
        doctorName: d.doctor_name || 'Specialist',
        specialty: d.specialty || 'General Neurology',
        hospital: d.hospital || 'Tezpur Medical College',
        dateTime: d.date_time || 'Upcoming',
        timeSlot: d.time_slot || '10:00 AM',
        consultationType: d.consultation_type || 'hospital_visit',
        symptoms: d.symptoms || '',
        phone: d.phone || '',
        status: d.status || 'confirmed',
        notes: d.notes || '',
        createdAt: d.created_at,
      }));
    }
  } catch (e) {
    console.warn('Error fetching appointments from Supabase:', e);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem('cognicare_appointments');
    if (cached) return JSON.parse(cached);
  } catch {}

  return [];
}

/**
 * Helper to save Caregiver & In-Home Nurse Booking into Supabase
 */
export async function saveBookingToSupabase(
  booking: Partial<CaregiverBooking>
): Promise<SupabaseResponse<CaregiverBooking>> {
  const newId = booking.id || `bk_${Date.now()}`;
  const record = {
    id: newId,
    patient_id: booking.patientId || 'pat_arpan_001',
    patient_name: booking.patientName || 'Arpan Das',
    service_type: booking.serviceType || 'elder_care',
    service_name: booking.serviceName || 'Dementia Support Caregiver',
    duration: booking.duration || 'hourly',
    start_date: booking.startDate || new Date().toISOString().split('T')[0],
    preferred_time_slot: booking.preferredTimeSlot || 'Morning 9 AM - 1 PM',
    address: booking.address || 'Tribeni Complex, Tezpur',
    pincode: booking.pincode || '784001',
    contact_name: booking.contactName || 'Sunita Das',
    contact_phone: booking.contactPhone || '+91 9876543210',
    special_needs: booking.specialNeeds || '',
    status: booking.status || 'confirmed',
    cost_estimate: booking.costEstimate || '₹650/shift',
    created_at: new Date().toISOString(),
  };

  // Local storage
  try {
    const existing = JSON.parse(
      localStorage.getItem('cognicare_bookings') || '[]'
    );
    const updated = [
      {
        ...booking,
        id: newId,
        createdAt: record.created_at,
      },
      ...existing,
    ];
    localStorage.setItem('cognicare_bookings', JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage booking error:', e);
  }

  // Direct Supabase insert
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([record])
      .select();

    if (!error) {
      console.log('✅ Successfully inserted booking into Supabase:', data);
      return {
        success: true,
        data: {
          id: newId,
          patientName: record.patient_name,
          serviceType: record.service_type as any,
          serviceName: record.service_name,
          duration: record.duration as any,
          startDate: record.start_date,
          preferredTimeSlot: record.preferred_time_slot,
          address: record.address,
          pincode: record.pincode,
          contactName: record.contact_name,
          contactPhone: record.contact_phone,
          specialNeeds: record.special_needs,
          status: 'confirmed',
          costEstimate: record.cost_estimate,
          createdAt: record.created_at,
        },
        source: 'supabase_direct',
      };
    } else {
      console.warn('Supabase bookings insert error:', error.message);
    }
  } catch (err) {
    console.warn('Direct bookings call exception:', err);
  }

  // Server proxy
  try {
    const res = await fetch('/api/supabase/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (res.ok) {
      const resData = await res.json();
      return { success: true, data: resData.data, source: 'server_proxy' };
    }
  } catch (proxyErr) {
    console.warn('Server proxy booking error:', proxyErr);
  }

  return {
    success: true,
    data: {
      id: newId,
      patientName: record.patient_name,
      serviceType: record.service_type as any,
      serviceName: record.service_name,
      duration: record.duration as any,
      startDate: record.start_date,
      preferredTimeSlot: record.preferred_time_slot,
      address: record.address,
      pincode: record.pincode,
      contactName: record.contact_name,
      contactPhone: record.contact_phone,
      specialNeeds: record.special_needs,
      status: 'confirmed',
      costEstimate: record.cost_estimate,
      createdAt: record.created_at,
    },
    source: 'local_fallback',
  };
}

/**
 * Fetch all caregiver bookings from Supabase
 */
export async function fetchBookingsFromSupabase(): Promise<CaregiverBooking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id || `bk_${d.id}`,
        patientId: d.patient_id,
        patientName: d.patient_name || 'Patient',
        serviceType: d.service_type || 'elder_care',
        serviceName: d.service_name || 'Caregiver Service',
        duration: d.duration || 'hourly',
        startDate: d.start_date || 'Today',
        preferredTimeSlot: d.preferred_time_slot || 'Morning',
        address: d.address || '',
        pincode: d.pincode || '',
        contactName: d.contact_name || '',
        contactPhone: d.contact_phone || '',
        specialNeeds: d.special_needs || '',
        status: d.status || 'confirmed',
        costEstimate: d.cost_estimate || 'Standard',
        createdAt: d.created_at,
      }));
    }
  } catch (e) {
    console.warn('Error fetching bookings from Supabase:', e);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem('cognicare_bookings');
    if (cached) return JSON.parse(cached);
  } catch {}

  return [];
}

/**
 * Helper to save Lab Report to Supabase
 */
export async function saveLabReportToSupabase(
  report: Partial<LabReport>,
  patientName: string
): Promise<SupabaseResponse<any>> {
  const record = {
    id: report.id || `rep_${Date.now()}`,
    patient_name: patientName,
    title: report.title,
    date: report.date || 'Today',
    doctor: report.doctor || 'Physician',
    summary: report.summary || '',
    file_size: report.fileSize || '1.2 MB',
    type: report.type || 'blood',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('health_records')
      .insert([record])
      .select();

    if (!error) {
      console.log('✅ Saved lab report to Supabase:', data);
      return { success: true, data, source: 'supabase_direct' };
    }
  } catch (err) {
    console.warn('Supabase health_records insert warning:', err);
  }

  return { success: true, data: record, source: 'local_fallback' };
}

/**
 * Helper to save Refill / Pharmacy Order to Supabase
 */
export async function saveMedicationRefillToSupabase(refillOrder: {
  medicationName: string;
  dosage: string;
  patientName: string;
  pharmacyName: string;
  pharmacyPhone: string;
  stockLeft: number;
}): Promise<SupabaseResponse<any>> {
  const record = {
    id: `refill_${Date.now()}`,
    medication_name: refillOrder.medicationName,
    dosage: refillOrder.dosage,
    patient_name: refillOrder.patientName,
    pharmacy_name: refillOrder.pharmacyName,
    pharmacy_phone: refillOrder.pharmacyPhone,
    stock_left: refillOrder.stockLeft,
    status: 'ordered',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('medication_orders')
      .insert([record])
      .select();

    if (!error) {
      console.log('✅ Saved medication order to Supabase:', data);
      return { success: true, data, source: 'supabase_direct' };
    }
  } catch (err) {
    console.warn('Supabase medication order insert warning:', err);
  }

  return { success: true, data: record, source: 'local_fallback' };
}
