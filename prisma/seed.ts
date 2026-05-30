// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});
type TestimonialClient = {
  testimonial: {
    upsert: (args: Record<string, unknown>) => Promise<unknown>;
  };
};
const client = prisma as unknown as TestimonialClient;

async function main() {
  console.log('🌱 Starting seed...');
  const school = await prisma.school.upsert({
    where: { schoolCode: 'HILLCITY-01' },
    update: {},
    create: {
      name: 'Hillcity Academy',
      schoolCode: 'HILLCITY-01',
      address: 'Anambra, Nigeria',
    },
  });
  console.log('✅ Created school:', school.name);

  // Seed testimonials if the model exists
  try {
    await client.testimonial.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        quote: 'HillCity cut our onboarding time in half — our staff love the clean workflow and dashboards.',
        name: 'Aisha Mbaye',
        role: 'Headteacher, Northfield Academy',
        avatar: 'https://your-project-ref.supabase.co/storage/v1/object/public/testimonials/avatar1.svg',
      },
    });
    await client.testimonial.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        quote: 'Reliable, fast, and secure — we rolled out 3 campuses in two weeks.',
        name: 'Marcus Lee',
        role: 'IT Manager, BrightFuture Schools',
        avatar: 'https://your-project-ref.supabase.co/storage/v1/object/public/testimonials/avatar2.svg',
      },
    });
    await client.testimonial.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        quote: 'Teachers found the grade and attendance tools intuitive from day one.',
        name: 'Nicole Ramos',
        role: 'Academic Director, Lakeside Prep',
        avatar: 'https://your-project-ref.supabase.co/storage/v1/object/public/testimonials/avatar3.svg',
      },
    });
    console.log('✅ Seeded testimonials (if model present)');
  } catch {
    // If Testimonial model doesn't exist yet (no migration), ignore
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });