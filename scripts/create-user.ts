import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('admin123', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@redzone.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
