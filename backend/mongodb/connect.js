import mongoose from 'mongoose';

async function run() {
    // Connect the client to the server	
    const uri = process.env.DB_URL;
    console.log(`mongodb url: ${uri}`);
    try {
        await mongoose.connect(uri);
        console.log("DB connected!");
    }
    catch (err) {
        console.log(`DB connection error: ${err.message}`);
    }
}
await run();