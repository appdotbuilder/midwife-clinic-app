
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['patient', 'midwife', 'admin']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const notificationTypeEnum = pgEnum('notification_type', ['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'general']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Patients table
export const patientsTable = pgTable('patients', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  full_name: text('full_name').notNull(),
  phone: text('phone'),
  date_of_birth: timestamp('date_of_birth'),
  address: text('address'),
  emergency_contact: text('emergency_contact'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Midwives table
export const midwivesTable = pgTable('midwives', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  full_name: text('full_name').notNull(),
  phone: text('phone'),
  license_number: text('license_number').notNull().unique(),
  specialization: text('specialization'),
  years_experience: integer('years_experience'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  duration_minutes: integer('duration_minutes').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Appointments table
export const appointmentsTable = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').notNull().references(() => patientsTable.id),
  midwife_id: integer('midwife_id').notNull().references(() => midwivesTable.id),
  service_id: integer('service_id').notNull().references(() => servicesTable.id),
  appointment_date: timestamp('appointment_date').notNull(),
  status: appointmentStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Medical records table
export const medicalRecordsTable = pgTable('medical_records', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').notNull().references(() => patientsTable.id),
  midwife_id: integer('midwife_id').notNull().references(() => midwivesTable.id),
  appointment_id: integer('appointment_id').references(() => appointmentsTable.id),
  visit_date: timestamp('visit_date').notNull(),
  chief_complaint: text('chief_complaint'),
  examination_findings: text('examination_findings'),
  diagnosis: text('diagnosis'),
  treatment_plan: text('treatment_plan'),
  medications: text('medications'),
  follow_up_notes: text('follow_up_notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Notifications table
export const notificationsTable = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  patient: one(patientsTable, {
    fields: [usersTable.id],
    references: [patientsTable.user_id]
  }),
  midwife: one(midwivesTable, {
    fields: [usersTable.id],
    references: [midwivesTable.user_id]
  }),
  notifications: many(notificationsTable)
}));

export const patientsRelations = relations(patientsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [patientsTable.user_id],
    references: [usersTable.id]
  }),
  appointments: many(appointmentsTable),
  medicalRecords: many(medicalRecordsTable)
}));

export const midwivesRelations = relations(midwivesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [midwivesTable.user_id],
    references: [usersTable.id]
  }),
  appointments: many(appointmentsTable),
  medicalRecords: many(medicalRecordsTable)
}));

export const appointmentsRelations = relations(appointmentsTable, ({ one, many }) => ({
  patient: one(patientsTable, {
    fields: [appointmentsTable.patient_id],
    references: [patientsTable.id]
  }),
  midwife: one(midwivesTable, {
    fields: [appointmentsTable.midwife_id],
    references: [midwivesTable.id]
  }),
  service: one(servicesTable, {
    fields: [appointmentsTable.service_id],
    references: [servicesTable.id]
  }),
  medicalRecords: many(medicalRecordsTable)
}));

export const medicalRecordsRelations = relations(medicalRecordsTable, ({ one }) => ({
  patient: one(patientsTable, {
    fields: [medicalRecordsTable.patient_id],
    references: [patientsTable.id]
  }),
  midwife: one(midwivesTable, {
    fields: [medicalRecordsTable.midwife_id],
    references: [midwivesTable.id]
  }),
  appointment: one(appointmentsTable, {
    fields: [medicalRecordsTable.appointment_id],
    references: [appointmentsTable.id]
  })
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [notificationsTable.user_id],
    references: [usersTable.id]
  })
}));

// Export all tables for drizzle queries
export const tables = {
  users: usersTable,
  patients: patientsTable,
  midwives: midwivesTable,
  services: servicesTable,
  appointments: appointmentsTable,
  medicalRecords: medicalRecordsTable,
  notifications: notificationsTable
};

// TypeScript types for table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Patient = typeof patientsTable.$inferSelect;
export type NewPatient = typeof patientsTable.$inferInsert;
export type Midwife = typeof midwivesTable.$inferSelect;
export type NewMidwife = typeof midwivesTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type NewService = typeof servicesTable.$inferInsert;
export type Appointment = typeof appointmentsTable.$inferSelect;
export type NewAppointment = typeof appointmentsTable.$inferInsert;
export type MedicalRecord = typeof medicalRecordsTable.$inferSelect;
export type NewMedicalRecord = typeof medicalRecordsTable.$inferInsert;
export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;
