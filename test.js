import { MongoClient } from "mongodb";

// const MONGO_URI =
//   "mongodb+srv://kirankumarchenna2004:ckk1234@cluster0.vlcwt.mongodb.net/"; // Replace with your actual URI

const MONGO_URI =
  "mongodb+srv://kirankumarchenna2004:ckk1234@cluster0.0t0lt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = "TaskManager"; // Your database name

async function testDBConnection() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    const db = client.db(DB_NAME);

    // Test fetching a collection
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    await client.close();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
}

testDBConnection();
