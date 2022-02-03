import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import typeDefs from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

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
    
    mongoose.connect(process.env.MONGO_URL || '').then(
        () => { console.log('DB connected'); }
    ).catch(
        err => { console.log('DB connection error: ', err) }
    );
    
    httpServer.listen(4000, () => {
        console.log('HTTP Server running on PORT 4000.');
    });
})();
