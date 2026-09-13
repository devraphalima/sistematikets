import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { db } from '@/data/db';

const typeDefs = gql`
  type Ticket {
    id: ID!
    title: String!
    description: String!
    status: String!
    priority: String!
    aiSuggestedReply: String
    createdAt: String!
  }

  type Query {
    tickets: [Ticket]
    ticket(id: ID!): Ticket
  }
`;

const resolvers = {
  Query: {
    tickets: () => db.getTickets(),
    ticket: (_: any, { id }: { id: string }) => db.getTickets().find(t => t.id === id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => ({ req, res }),
});

export { handler as GET, handler as POST };
