const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000; // Render sets PORT automatically

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection string (use environment variable for security)
const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://matt:gBzVCaQuz71S3vMc@call-notes-cluster.yo0cs.mongodb.net/?retryWrites=true&w=majority&appName=call-notes-cluster";
const client = new MongoClient(uri);

// Connect to MongoDB once and reuse the connection
let db;
async function connectDB() {
  try {
    await client.connect();
    db = client.db("call-notes-cluster"); // Database name
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();
// In-memory data (replace with a database for persistence)
// let items = [
//   {
//     id: 1,
//     name: "Item 1",
//     source: "Advisor 1",
//     date: "01-05-2025",
//     notes: "this is a note.",
//   },
// ];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to My Simple API with MongoDB!");
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await db.collection("items").find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).send("Error fetching items");
  }
});

// Get a single item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const item = await db
      .collection("items")
      .findOne({ id: parseInt(req.params.id) });
    if (item) res.json(item);
    else res.status(404).send("Item not found");
  } catch (err) {
    res.status(500).send("Error fetching item");
  }
});

// Add a new item
app.post("/items", async (req, res) => {
  try {
    const lastItem = await db
      .collection("items")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newId = lastItem.length > 0 ? lastItem[0].id + 1 : 1;
    const newItem = {
      id: newId,
      name: req.body.name,
      source: req.body.source,
      date: req.body.date,
      notes: req.body.notes,
    };
    await db.collection("items").insertOne(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).send("Error adding item");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

// Graceful shutdown (optional, for Render)
process.on("SIGTERM", async () => {
  await client.close();
  process.exit(0);
});
