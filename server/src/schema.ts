
import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['patient', 'midwife', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const appointmentStatusSchema = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const notificationTypeSchema = z.enum(['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'general']);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Patient schema
export const patientSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  full_name: z.string(),
  phone: z.string().nullable(),
  date_of_birth: z.coerce.date().nullable(),
  address: z.string().nullable(),
  emergency_contact: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Patient = z.infer<typeof patientSchema>;

// Midwife schema
export const midwifeSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  full_name: z.string(),
  phone: z.string().nullable(),
  license_number: z.string(),
  specialization: z.string().nullable(),
  years_experience: z.number().int().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Midwife = z.infer<typeof midwifeSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  duration_minutes: z.number().int(),
  price: z.number(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

// Appointment schema
export const appointmentSchema = z.object({
  id: z.number(),
  patient_id: z.number(),
  midwife_id: z.number(),
  service_id: z.number(),
  appointment_date: z.coerce.date(),
  status: appointmentStatusSchema,
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Appointment = z.infer<typeof appointmentSchema>;

// Medical record schema
export const medicalRecordSchema = z.object({
  id: z.number(),
  patient_id: z.number(),
  midwife_id: z.number(),
  appointment_id: z.number().nullable(),
  visit_date: z.coerce.date(),
  chief_complaint: z.string().nullable(),
  examination_findings: z.string().nullable(),
  diagnosis: z.string().nullable(),
  treatment_plan: z.string().nullable(),
  medications: z.string().nullable(),
  follow_up_notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type MedicalRecord = z.infer<typeof medicalRecordSchema>;

// Notification schema
export const notificationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.coerce.date()
});

export type Notification = z.infer<typeof notificationSchema>;

// Input schemas for creating entities

// Auth schemas
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerPatientInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  phone: z.string().nullable(),
  date_of_birth: z.coerce.date().nullable(),
  address: z.string().nullable(),
  emergency_contact: z.string().nullable()
});

export type RegisterPatientInput = z.infer<typeof registerPatientInputSchema>;

// Service input schemas
export const createServiceInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  duration_minutes: z.number().int().positive(),
  price: z.number().positive()
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

export const updateServiceInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  duration_minutes: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  is_active: z.boolean().optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

// Appointment input schemas
export const createAppointmentInputSchema = z.object({
  patient_id: z.number(),
  midwife_id: z.number(),
  service_id: z.number(),
  appointment_date: z.coerce.date(),
  notes: z.string().nullable()
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentInputSchema>;

export const updateAppointmentStatusInputSchema = z.object({
  id: z.number(),
  status: appointmentStatusSchema,
  notes: z.string().nullable().optional()
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusInputSchema>;

// Medical record input schemas
export const createMedicalRecordInputSchema = z.object({
  patient_id: z.number(),
  midwife_id: z.number(),
  appointment_id: z.number().nullable(),
  visit_date: z.coerce.date(),
  chief_complaint: z.string().nullable(),
  examination_findings: z.string().nullable(),
  diagnosis: z.string().nullable(),
  treatment_plan: z.string().nullable(),
  medications: z.string().nullable(),
  follow_up_notes: z.string().nullable()
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordInputSchema>;

// Notification input schemas
export const createNotificationInputSchema = z.object({
  user_id: z.number(),
  type: notificationTypeSchema,
  title: z.string().min(1),
  message: z.string().min(1)
});

export type CreateNotificationInput = z.infer<typeof createNotificationInputSchema>;

export const markNotificationReadInputSchema = z.object({
  id: z.number()
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadInputSchema>;

// Query input schemas
export const getAppointmentsByPatientInputSchema = z.object({
  patient_id: z.number()
});

export type GetAppointmentsByPatientInput = z.infer<typeof getAppointmentsByPatientInputSchema>;

export const getAppointmentsByMidwifeInputSchema = z.object({
  midwife_id: z.number()
});

export type GetAppointmentsByMidwifeInput = z.infer<typeof getAppointmentsByMidwifeInputSchema>;

export const getMedicalRecordsByPatientInputSchema = z.object({
  patient_id: z.number()
});

export type GetMedicalRecordsByPatientInput = z.infer<typeof getMedicalRecordsByPatientInputSchema>;

export const getNotificationsByUserInputSchema = z.object({
  user_id: z.number()
});

export type GetNotificationsByUserInput = z.infer<typeof getNotificationsByUserInputSchema>;
