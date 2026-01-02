import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function createUser() {
  try {
    console.log('🔐 Creating admin user...');

    const email = 'heshammoha2231992@gmail.com';
    const password = '632024';
    const username = 'admin';

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log('User:', existingUser);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('✅ User created successfully!');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Active:', user.isActive);
    console.log('\n🔑 Login credentials:');
    console.log('Email/Username:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();

