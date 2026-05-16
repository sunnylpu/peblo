"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
let connectionString = process.env.DATABASE_URL || '';
// Handle Prisma 7's new local dev proxy URLs
if (connectionString.startsWith('prisma+postgres://')) {
    try {
        const urlObj = new URL(connectionString);
        const apiKeyStr = urlObj.searchParams.get('api_key') || '';
        const decoded = Buffer.from(apiKeyStr, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);
        if (parsed.databaseUrl) {
            connectionString = parsed.databaseUrl;
        }
    }
    catch (err) {
        console.error('Failed to parse prisma+postgres URL', err);
    }
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter,
        log: ['query'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
