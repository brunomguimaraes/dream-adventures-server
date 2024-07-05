import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
  },
  Mutation: {
    createUser: async (_: any, { name, email, password }: any) => {
      return await prisma.user.create({
        data: { name, email, password },
      });
    },
  },
};
