import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Prisma 7 requires adapter - using direct connection
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default settings (only if none exist)
  const existingSettings = await prisma.settings.findFirst();
  
  if (!existingSettings) {
    const settings = await prisma.settings.create({
      data: {
        siteName: 'KMG Investment',
        siteTagline: 'Investment Excellence',
        siteSubtagline: 'Building Tomorrow\'s Leaders',
        emailPlaceholder: 'Enter your email address',
        emailButtonText: 'Notify Me',
        emailSuccessMsg: 'Thank you! We\'ll notify you when we launch.',
        emailPromptMsg: 'Be the first to experience the extraordinary',
        portfolioTitle: 'Our Portfolio',
        footerText: '© 2024 · All Rights Reserved',
      },
    });
    console.log('✅ Settings created:', settings);
  } else {
    console.log('ℹ️ Settings already exist, skipping...');
  }

  // Create sample companies (only if none exist)
  const existingCompanies = await prisma.company.findFirst();
  
  if (!existingCompanies) {
    const companies = [
      {
        name: 'Company Alpha',
        logo: '/companies/company-1.png',
        description: 'Leading technology solutions provider',
        website: 'https://example.com',
        order: 1,
        comingSoon: true,
      },
      {
        name: 'Company Beta',
        logo: '/companies/company-2.png',
        description: 'Innovative healthcare services',
        website: 'https://example.com',
        order: 2,
        comingSoon: true,
      },
      {
        name: 'Company Gamma',
        logo: '/companies/company-3.png',
        description: 'Sustainable energy solutions',
        website: 'https://example.com',
        order: 3,
        comingSoon: true,
      },
    ];

    for (const company of companies) {
      const created = await prisma.company.create({
        data: company,
      });
      console.log('✅ Company created:', created.name);
    }
  } else {
    console.log('ℹ️ Companies already exist, skipping...');
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

