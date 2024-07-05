import { PrismaClient } from '@prisma/client';
import { createApolloServer } from '@loaders/apollo';
import { config } from 'config';

const prisma = new PrismaClient();

const startServer = async () => {
  try {
    const server = createApolloServer();
    server.listen({ port: config.port }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  } finally {
    await prisma.$disconnect();
  }
};

startServer();
