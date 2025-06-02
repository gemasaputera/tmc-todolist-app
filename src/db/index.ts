import { PrismaClient } from '@prisma/client';

declare global {
  var prismaClient: PrismaClient | undefined;
}

const db = createPrismaClient();

function createPrismaClient() {
  if (!globalThis.prismaClient) {
    globalThis.prismaClient = new PrismaClient({
      // log: [{ emit: 'stdout', level: 'query' }]
    });
  }
  return globalThis.prismaClient;
}

export default db;
