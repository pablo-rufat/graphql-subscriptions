import axios from 'axios';
import dotenv from 'dotenv';
import { dbConnect } from '../src/config/db';
import Message from '../src/model/Message';
import mongoose from 'mongoose';

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME_TEST,
} = process.env;

beforeAll(async () => {
  await dbConnect(DB_USER!, DB_PASSWORD!, DB_HOST!, DB_PORT!, DB_NAME_TEST!);
  Message.remove();
});

afterAll(() => {
  mongoose.connection.close();
});

describe('Example test', () => {
  test('Test 1', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: `
        query Messages {
          messages {
            text
            createdBy
          }
        }
      `,
    });

    const messages = response.data.data.messages;
    expect(messages.length).toBe(0);
  });
});
