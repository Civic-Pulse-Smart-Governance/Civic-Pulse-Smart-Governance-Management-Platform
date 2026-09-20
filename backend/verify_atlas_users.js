const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://ajay:12345@cluster0.rozdp0g.mongodb.net/civicpulse?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("[DB] Connected to MongoDB Atlas.");
    const db = client.db('civicpulse');
    const users = await db.collection('users').find({}).toArray();
    
    console.log("\nRegistered Users in MongoDB Atlas:");
    if (users.length === 0) {
      console.log(" (No users found)");
    } else {
      users.forEach(u => {
        console.log(` - Name: ${u.name}, Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}, CreatedAt: ${u.createdAt}`);
      });
    }
  } catch (err) {
    console.error("Error querying MongoDB Atlas:", err.message);
  } finally {
    await client.close();
  }
}

run();
