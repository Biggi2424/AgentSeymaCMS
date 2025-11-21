import { PrismaClient } from "./generated/prisma";

export type DbClient = PrismaClient;

let prismaClient: PrismaClient | undefined;

export function getDb(): DbClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}
