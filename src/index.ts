import { ApolloServer } from "@apollo/server";
import express from "express";

import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db"; // Corrected this import
import createApolloGraphqlServer from "./graphql";

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
    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

init();
