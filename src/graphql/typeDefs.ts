import { gql } from "apollo-server";

export default gql`
    type Message {
        text: String
        createdBy: String
    }

    input MessageInput {
        text: String
        username: String
    }

    type Query {
        message(id: ID!): Message
        messages: [Message!]
    }

    type Mutation {
        createMessage(messageInput: MessageInput): Message!
    }

    type Subscription {
        messageCreated: Message
    }
`;