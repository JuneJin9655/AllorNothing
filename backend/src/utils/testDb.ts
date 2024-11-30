import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;


export const connect = async () => {
  if(!mongoServer){
    mongoServer = await MongoMemoryServer.create();
  }
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0){
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
  console.log('mmDatabase connected successfully');

};

export const clear = async () => {
  if (mongoose.connection?.db) {
    await mongoose.connection.db.dropDatabase(); // 清空数据库
    console.log('Database cleared successfully.');
  }else{
    console.error('Mongoose connection database is undefined.');
  }
};

export const close = async () => {
  if(mongoServer){
    await mongoose.disconnect();
    await mongoServer.stop();
    mongoServer = null;
  }
}