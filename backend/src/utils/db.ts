import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let connectionString = process.env.DATABASE_URL || '';

if (connectionString.startsWith('prisma+postgres://')) {
  try {
    const urlObj = new URL(connectionString);
    const apiKeyStr = urlObj.searchParams.get('api_key') || '';
    const decoded = Buffer.from(apiKeyStr, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (parsed.databaseUrl) {
      // Force it to use 'postgres' database instead of 'template1'
      // And replace localhost with 127.0.0.1 to avoid IPv6 ECONNREFUSED issues
      connectionString = parsed.databaseUrl.replace('/template1', '/postgres').replace('localhost', '127.0.0.1');
    }
  } catch (err) {
    console.error('Failed to parse prisma+postgres URL', err);
  }
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Override the environment variable so PrismaClient picks it up natively
process.env.DATABASE_URL = connectionString;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
