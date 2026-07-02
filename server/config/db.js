const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

let mongoServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const hasCustomUri = process.env.MONGODB_URI || (process.env.NODE_ENV === 'test' && process.env.MONGODB_TEST_URI);

    if (hasCustomUri) {
      const uri = process.env.MONGODB_URI || process.env.MONGODB_TEST_URI;
      await mongoose.connect(uri);
      console.log(`MongoDB connected successfully to configured URI [Env: ${process.env.NODE_ENV || 'development'}].`);
      return;
    }

    // Try connecting to default local MongoDB instance first
    const defaultUri = process.env.NODE_ENV === 'test' 
      ? 'mongodb://127.0.0.1:27017/furnova_test'
      : 'mongodb://127.0.0.1:27017/furnova';

    try {
      // Use 2-second timeout to fail fast if MongoDB is not running locally
      await mongoose.connect(defaultUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB connected successfully to local database: ${defaultUri} [Env: ${process.env.NODE_ENV || 'development'}].`);
    } catch (localErr) {
      console.log('Local MongoDB service not found. Launching in-memory MongoDB server...');
      
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`MongoDB connected successfully to in-memory server: ${memoryUri}`);
      
      // Update environment variable so other components can access it if needed
      process.env.MONGODB_URI = memoryUri;

      // Automatically seed the in-memory database with initial products
      try {
        console.log('Automatically seeding in-memory database...');
        const seedDatabase = require('../seed');
        await seedDatabase(false);
      } catch (seedErr) {
        console.error('Failed to auto-seed in-memory database:', seedErr.message);
      }
    }
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    if (process.env.NODE_ENV === 'test') {
      throw err;
    } else {
      process.exit(1);
    }
  }
};

// Gracefully stop the in-memory server on termination
process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;

