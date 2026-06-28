import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaConnectStarted?: boolean;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Warm DB connection in the background so first API call is faster */
if (!globalForPrisma.prismaConnectStarted) {
  globalForPrisma.prismaConnectStarted = true;
  void prisma.$connect().catch(() => {
    /* DB may be offline — graph-store falls back to sample data */
  });
}
