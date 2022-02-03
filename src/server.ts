import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { BREAK, execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import typeDefs from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { dbConnect } from './config/db';

dotenv.config();

( async function() {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
    },
    {
        server: httpServer,
        path: '/graphql'
    });

    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart(){
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        }
                    }
                }
            }
        ],
    });

    await server.start();

    server.applyMiddleware({ app });

    const {
        NODE_ENV,
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME_DEV,
        DB_NAME_TEST,
        DB_NAME_PROD,
    } = process.env;

    let mongoDB = '';
    switch (NODE_ENV) {
        case 'develop':
            mongoDB = DB_NAME_DEV!;
            break;
        case 'production':
            mongoDB = DB_NAME_PROD!;
            break;
        case 'test':
            mongoDB = DB_NAME_TEST!;
            break;
    }
    await dbConnect(DB_USER!, DB_PASSWORD!, DB_HOST!, DB_PORT!, mongoDB);
    
    httpServer.listen(4000, () => {
        console.log('HTTP Server running on PORT 4000.');
    });
})();
