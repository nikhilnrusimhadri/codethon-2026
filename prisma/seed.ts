import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });
  await prisma.eventSettings.upsert({ where: { id: 'default-event-settings' }, update: {}, create: { id: 'default-event-settings' } });
  console.log(`Admin seeded: ${email}`);
}
main().finally(() => prisma.$disconnect());
