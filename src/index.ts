import { ApolloServer } from "@apollo/server";
import express from "express";

import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

const init = async () => {
    const app = express();

    const PORT = Number(process.env.PORT) || 8000;

    // Create GraphQL server


    app.use(express.json());


    app.get("/", (req, res) => {
        res.json({
            message: "hello",
        });
    });

    const gqlServer = await createApolloGraphqlServer();
    app.use("/graphql", expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            const token = req.headers['token'];

            if (!token) {
                throw new Error('No token provided');
            }

            const tokenString = Array.isArray(token) ? token[0] : token;

            // console.log(tokenString);
            try {

                const user = await UserService.decodeJWTtoken(tokenString as string);

                return { user };
            } catch (error: any) {

                return {};
            }
        }
    }));


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

init();
