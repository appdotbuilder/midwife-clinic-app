
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  loginInputSchema, 
  registerPatientInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  createAppointmentInputSchema,
  updateAppointmentStatusInputSchema,
  getAppointmentsByPatientInputSchema,
  getAppointmentsByMidwifeInputSchema,
  createMedicalRecordInputSchema,
  getMedicalRecordsByPatientInputSchema,
  createNotificationInputSchema,
  markNotificationReadInputSchema,
  getNotificationsByUserInputSchema
} from './schema';

// Import handlers
import { loginUser, registerPatient } from './handlers/auth';
import { getServices, createService, updateService } from './handlers/services';
import { 
  createAppointment, 
  getAppointmentsByPatient, 
  getAppointmentsByMidwife, 
  updateAppointmentStatus, 
  getAllAppointments 
} from './handlers/appointments';
import { getAllPatients, getPatientById } from './handlers/patients';
import { getAllMidwives, getMidwifeById } from './handlers/midwives';
import { 
  createMedicalRecord, 
  getMedicalRecordsByPatient, 
  getAllMedicalRecords 
} from './handlers/medical_records';
import { 
  createNotification, 
  getNotificationsByUser, 
  markNotificationAsRead 
} from './handlers/notifications';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),
  
  registerPatient: publicProcedure
    .input(registerPatientInputSchema)
    .mutation(({ input }) => registerPatient(input)),

  // Service routes
  getServices: publicProcedure
    .query(() => getServices()),
  
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  
  updateService: publicProcedure
    .input(updateServiceInputSchema)
    .mutation(({ input }) => updateService(input)),

  // Patient routes
  getAllPatients: publicProcedure
    .query(() => getAllPatients()),
  
  getPatientById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPatientById(input.id)),

  // Midwife routes
  getAllMidwives: publicProcedure
    .query(() => getAllMidwives()),
  
  getMidwifeById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getMidwifeById(input.id)),

  // Appointment routes
  createAppointment: publicProcedure
    .input(createAppointmentInputSchema)
    .mutation(({ input }) => createAppointment(input)),
  
  getAppointmentsByPatient: publicProcedure
    .input(getAppointmentsByPatientInputSchema)
    .query(({ input }) => getAppointmentsByPatient(input)),
  
  getAppointmentsByMidwife: publicProcedure
    .input(getAppointmentsByMidwifeInputSchema)
    .query(({ input }) => getAppointmentsByMidwife(input)),
  
  updateAppointmentStatus: publicProcedure
    .input(updateAppointmentStatusInputSchema)
    .mutation(({ input }) => updateAppointmentStatus(input)),
  
  getAllAppointments: publicProcedure
    .query(() => getAllAppointments()),

  // Medical record routes
  createMedicalRecord: publicProcedure
    .input(createMedicalRecordInputSchema)
    .mutation(({ input }) => createMedicalRecord(input)),
  
  getMedicalRecordsByPatient: publicProcedure
    .input(getMedicalRecordsByPatientInputSchema)
    .query(({ input }) => getMedicalRecordsByPatient(input)),
  
  getAllMedicalRecords: publicProcedure
    .query(() => getAllMedicalRecords()),

  // Notification routes
  createNotification: publicProcedure
    .input(createNotificationInputSchema)
    .mutation(({ input }) => createNotification(input)),
  
  getNotificationsByUser: publicProcedure
    .input(getNotificationsByUserInputSchema)
    .query(({ input }) => getNotificationsByUser(input)),
  
  markNotificationAsRead: publicProcedure
    .input(markNotificationReadInputSchema)
    .mutation(({ input }) => markNotificationAsRead(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
