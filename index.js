const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Render sets PORT automatically

// Middleware to parse JSON
app.use(express.json());

// In-memory data (replace with a database for persistence)
let items = [
  {
    id: 1,
    name: "Item 1",
    source: "Advisor 1",
    date: "01-05-2025",
    notes: "this is a note.",
  },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to My Simple API!");
});

// Get all items
app.get("/items", (req, res) => {
  res.json(items);
});

// Get a single item by ID
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (item) res.json(item);
  else res.status(404).send("Item not found");
});

// Add a new item
app.post("/items", (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    source: req.body.source,
    date: req.body.date,
    notes: req.body.notes,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Start the server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
