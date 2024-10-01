import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer() {

    const gqlServer = new ApolloServer({
        typeDefs: `
        type TokenResponse {
        token: String!
    }
      type Query {
      ${User.queries}
      }

      type Mutation {
       ${User.mutations}
      }
    `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutation
            },
        },
    });

    await gqlServer.start();

    return gqlServer;

}

export default createApolloGraphqlServer;

