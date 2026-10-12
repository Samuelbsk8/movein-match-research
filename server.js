const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

const db = new Database("movein-match.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS match_calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    your_budget TEXT,
    roommate_budget TEXT,
    your_cleanliness TEXT,
    roommate_cleanliness TEXT,
    your_sleep_schedule TEXT,
    roommate_sleep_schedule TEXT,
    your_guest_preference TEXT,
    roommate_guest_preference TEXT,
    score INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/match", (req, res) => {
  const { you, roommate } = req.body;

  if (!you || !roommate) {
    return res.status(400).json({ error: "Please fill out both preference forms." });
  }

  const categories = [
    { name: "budget", label: "budget" },
    { name: "cleanliness", label: "cleanliness level" },
    { name: "sleep", label: "sleep schedule" },
    { name: "guests", label: "guest preference" }
  ];

  let matchingCategories = [];

  for (const category of categories) {
    if (you[category.name] === roommate[category.name]) {
      matchingCategories.push(category.label);
    }
  }

  const score = Math.round((matchingCategories.length / categories.length) * 100);

  db.prepare(`
    INSERT INTO match_calculations (
      your_budget, roommate_budget,
      your_cleanliness, roommate_cleanliness,
      your_sleep_schedule, roommate_sleep_schedule,
      your_guest_preference, roommate_guest_preference,
      score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    you.budget,
    roommate.budget,
    you.cleanliness,
    roommate.cleanliness,
    you.sleep,
    roommate.sleep,
    you.guests,
    roommate.guests,
    score
  );

  let message;

  if (score === 100) {
    message = "Great match! You have the same preferences in every category.";
  } else if (score >= 50) {
    message = `You match in: ${matchingCategories.join(", ")}.`;
  } else {
    message = "You have different preferences, so you may want to discuss expectations before moving in.";
  }

  res.json({ score, message });
});

app.listen(PORT, () => {
  console.log(`MoveIn Match is running at http://localhost:${PORT}`);
});