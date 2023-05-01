import { PrismaClient, role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const hashPwd = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
  return await bcrypt.hash(password, saltRounds);
};

async function main() {
  const hashedPwd = await hashPwd('PA$$Word@234');

  await prisma.user.upsert({
    where: { email: 'something123@gmail.com' },
    update: {},
    create: {
      email: 'something123@gmail.com',
      password: hashedPwd,
      name: 'Something 123',
      role: role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something652@gmail.com' },
    update: {},
    create: {
      email: 'something652@gmail.com',
      password: hashedPwd,
      name: 'Something 652',
      role: role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'somethingabc@gmail.com' },
    update: {},
    create: {
      email: 'somethingabc@gmail.com',
      password: hashedPwd,
      name: 'Something abc',
      role: role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something982@gmail.com' },
    update: {},
    create: {
      email: 'something982@gmail.com',
      password: hashedPwd,
      name: 'Something 982',
      role: role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something672@gmail.com' },
    update: {},
    create: {
      email: 'something672@gmail.com',
      password: hashedPwd,
      name: 'Something 672',
      role: role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something452@gmail.com' },
    update: {},
    create: {
      email: 'something452@gmail.com',
      password: hashedPwd,
      name: 'Something 452',
      role: role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something723@gmail.com' },
    update: {},
    create: {
      email: 'something723@gmail.com',
      password: hashedPwd,
      name: 'Something 723',
      role: role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'something902@gmail.com' },
    update: {},
    create: {
      email: 'something902@gmail.com',
      password: hashedPwd,
      name: 'Something 902',
      role: role.USER,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
