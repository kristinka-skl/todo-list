import mongoose from 'mongoose';
// import { Order } from '../models/order.js';
// import { Note } from '../models/note.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) throw new Error('Missing env MONGODB_URL');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    // await Order.syncIndexes();
    // console.log('Indexes synced successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
    }
    process.exit(1);
  }
};
