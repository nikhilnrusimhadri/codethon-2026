import { z } from 'zod';
export const branches = ['CSE','CSM','EEE','ECE','MECHANICAL','CIVIL'] as const;
export const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  rollNumber: z.string().trim().min(2).max(40),
  collegeEmail: z.string().trim().email().max(150),
  phoneNumber: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  branch: z.enum(branches),
  section: z.string().trim().max(20).optional().or(z.literal('')),
  year: z.literal(3),
  declaration: z.literal(true),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
