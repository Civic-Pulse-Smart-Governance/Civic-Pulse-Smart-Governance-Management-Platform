const { MongoClient } = require('mongodb');

const candidates = [
  '1e58d278-1a18-4c92-9d06-397d8504325d',
  'vqnowsvy',
  'interninfosys4_db_user',
  'interninfosys4',
  'infosys',
  'intern',
  'Cluster0',
  'admin',
  'password'
];

async function testConnection(password) {
  const encodedPassword = encodeURIComponent(password);
  const uri = `mongodb+srv://interninfosys4_db_user:${encodedPassword}@cluster0.rozdp0g.mongodb.net/?appName=Cluster0`;
  
  console.log(`Testing password: "${password}"...`);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  
  try {
    await client.connect();
    console.log(`\n[SUCCESS] Connected successfully with password: "${password}"!`);
    const dbList = await client.db().admin().listDatabases();
    console.log("Databases:");
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
    await client.close();
    return true;
  } catch (err) {
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.log(`[FAILED] Auth failed.`);
    } else {
      console.error(`[ERROR] Other error for "${password}":`, err.message);
    }
    await client.close();
    return false;
  }
}

async function run() {
  for (const pwd of candidates) {
    const success = await testConnection(pwd);
    if (success) {
      process.exit(0);
    }
  }
  console.log("\nAll candidate passwords failed.");
  process.exit(1);
}

run();
