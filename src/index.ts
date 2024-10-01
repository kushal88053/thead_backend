import { ApolloServer } from "@apollo/server";
import express from "express";

import { expressMiddleware } from "@apollo/server/express4";
import { Query } from "mongoose";


const init = async () => {

    const app = express();

    const PORT = Number(process.env.PORT) || 8000;

    // create graphQl server 

    const gqlServer = new ApolloServer({
        typeDefs: `
        
        type Query {
        
          hello : String , 
          say(name:String) : String ,
        
        }
        `,
        resolvers: {

            Query: {
                hello: () => `hello i am graphql server`,
                say: (_, { name }: { name: String }) => `Hey ${name} , How are you`
            }
        },

    })

    app.use(express.json());

    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({
            message: "hello"
        }
        );
    })

    app.use('/graphql', expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`servet run on the ${PORT}`);
    })
}

init();
