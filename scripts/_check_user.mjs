import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const u = await prisma.user.findUnique({
  where: { email: 'yapy.mambo@gmail.com' },
  select: { id: true, email: true, role: true, totpEnabled: true, password: true, emailVerified: true },
});
console.log(u ? { ...u, password: u.password ? '[SET]' : null } : 'NOT FOUND');
await prisma.$disconnect();
