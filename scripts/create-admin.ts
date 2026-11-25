// scripts/create-admin.ts
// Create a NEW admin — or reset an existing user's password (upsert by email).
// Password + email are read from env vars so nothing secret is committed or printed.
//
// Run from the project root:
//   ADMIN_EMAIL='you@example.com' ADMIN_PASSWORD='choose-a-strong-one' ADMIN_NAME='Your Name' npx tsx scripts/create-admin.ts
//
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Admin';

  if (!email || !password) {
    console.error('Missing env vars. Set ADMIN_EMAIL and ADMIN_PASSWORD.');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error('Refusing weak password: use at least 10 characters.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'admin', name },        // resets an existing user to a known password
    create: { email, name, password: hashed, role: 'admin' }, // or creates a fresh admin
    select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  console.log('Admin ready (role must be lowercase "admin" to pass the auth checks):');
  console.log(user);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
