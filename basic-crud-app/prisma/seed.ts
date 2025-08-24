import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { name: 'Tech' },
    update: {},
    create: { name: 'Tech' },
  });

  const lifeCategory = await prisma.category.upsert({
    where: { name: 'Lifestyle' },
    update: {},
    create: { name: 'Lifestyle' },
  });

  // Create users with posts and connect posts to categories
  await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'Hello World!',
            categories: {
              connect: [{ id: techCategory.id }],
            },
          },
          {
            title: 'Second Post',
            content: 'Prisma is awesome',
            categories: {
              connect: [{ id: techCategory.id }, { id: lifeCategory.id }],
            },
          },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      posts: {
        create: [
          {
            title: "Bob's Post",
            content: 'Loved the lifestyle category',
            categories: {
              connect: [{ id: lifeCategory.id }],
            },
          },
        ],
      },
    },
  });

  console.log('Database has been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
