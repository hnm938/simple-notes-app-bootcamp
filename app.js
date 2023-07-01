const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for parsing urlencoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// API routes
app.get("/api/notes", (req, res) => {
  // Read the notes from the JSON file
  const notes = getNotesFromFile();
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  // Generate a unique ID for the note
  newNote.id = generateUniqueId();
  // Read the existing notes from the JSON file
  const notes = getNotesFromFile();
  // Add the new note to the array
  notes.push(newNote);
  // Write the updated notes array to the JSON file
  saveNotesToFile(notes);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  // Read the existing notes from the JSON file
  const notes = getNotesFromFile();
  // Find the index of the note with the specified ID
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    // Remove the note from the array
    notes.splice(noteIndex, 1);
    // Write the updated notes array to the JSON file
    saveNotesToFile(notes);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// HTML routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Helper functions

// Read notes from the JSON file
function getNotesFromFile() {
  const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
  return JSON.parse(data);
}

// Write notes to the JSON file
function saveNotesToFile(notes) {
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes));
}

// Generate a unique ID using the current timestamp
function generateUniqueId() {
  return Date.now().toString();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
