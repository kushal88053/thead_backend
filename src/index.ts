import { ApolloServer } from "@apollo/server";
import express from "express";

import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db"; // Corrected this import

const init = async () => {
    const app = express();

    const PORT = Number(process.env.PORT) || 8000;

    // Create GraphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }

      type Mutation {
        createUser(
          firstName: String!
          lastName: String!
          email: String!
          password: String!
        ): Boolean
      }
    `,
        resolvers: {
            Query: {
                hello: () => `Hello, I am a GraphQL server`,
                say: (_, { name }: { name: string }) => `Hey ${name}, how are you?`,
            },
            Mutation: {
                createUser: async (
                    _: any,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: { firstName: string; lastName: string; email: string; password: string }
                ) => {
                    try {
                        await prismaClient.user.create({
                            data: {
                                firstName,
                                lastName,
                                email,
                                password,
                                salt: "qweqwe",
                            },
                        });
                        return true;
                    } catch (error) {
                        console.error(error);
                        return false;
                    }
                },
            },
        },
    });

    app.use(express.json());

    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({
            message: "hello",
        });
    });

    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

init();
