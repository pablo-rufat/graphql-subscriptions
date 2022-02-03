import Message from "../model/Message";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

interface CreateMessageArgs {
    messageInput: {
        text: string;
        username: string;
    }
};

export const resolvers = {
    Mutation: {
        async createMessage(_: any, args: CreateMessageArgs) {
            const newMessage = new Message({
                text: args.messageInput.text,
                createdBy: args.messageInput.username,
            });

            const res = await newMessage.save();

            pubSub.publish('MESSAGE_CREATED', {
                messageCreated: {
                    text: args.messageInput.text,
                    createdBy: args.messageInput.username,
                }
            });

            return {
                id: res.id,
                ...res._doc,
            }
        } 
    },
    Subscription: {
        messageCreated: {
            subscribe: () => pubSub.asyncIterator('MESSAGE_CREATED')
        }
    },
    Query: {
        messages: async (_: any, args: any) => Message.find(),
        message: async (_: any, args: any) => Message.findById(args.id)
    }
};