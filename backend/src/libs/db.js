import { PrismaClient } from "../generated/prisma/index.js";

// Use the global object to store the Prisma instance
const globalForPrisma = globalThis;

// Reuse existing Prisma instance if available, otherwise create a new one
export const db = globalForPrisma.prisma || new PrismaClient();

// In development, store the Prisma instance globally to avoid reinitializing on hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
