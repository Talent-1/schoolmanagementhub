import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Force floating point numbers to stay as numbers
types.setTypeParser(1700, (val) => parseFloat(val));

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { 
  pool: Pool, 
  prisma: PrismaClient 
};

// 1. IMPROVED POOL CONFIGURATION
const pool = globalForPrisma.pool || new Pool({ 
  connectionString,
  // Increase max connections slightly for concurrent dashboard requests
  max: 10, 
  // How long a client is allowed to sit idle before being closed
  idleTimeoutMillis: 30000, 
  // How long to wait for a connection before timing out
  connectionTimeoutMillis: 10000, 
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;