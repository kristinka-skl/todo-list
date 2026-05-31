import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mms = MongoMemoryServer.create();

export const connectDatabase = async () => {
   const uri = await (await mms).getUri();
   await mongoose.connect(uri);
}

export const closeDatabase = async () => {
   await mongoose.connection.dropDatabase();
   await mongoose.connection.close();
   await (await mms).stop();
}

export const clearDatabase = async () => {
   const collections = mongoose.connection.collections;
   for (const key in collections) {
      const collection = collections[key];
      await collection?.deleteMany({});
   }
}
