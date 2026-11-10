/* ---------- HABIT TRACKER BACKEND ----------
   A tiny web server that does two jobs:
   1. Serves your index.html to any device that opens it.
   2. Stores everyone's habits in one shared file (habits.json),
      so your PC and phone read and write the SAME data.
*/

const express = require("express");
const fs = require("fs");
const os = require("os");

const app = express();
const PORT = 3000;
const DATA_FILE = "habits.json";

app.use(express.json());        // lets the server understand incoming JSON
app.use(express.static("."));   // serves index.html from this folder

/* LOAD: a device asks for the current habits */
app.get("/habits", (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    res.send(fs.readFileSync(DATA_FILE, "utf8"));
  } else {
    res.json([{ name: "My New Habit", completed: [] }]);  // first-time default
  }
});

/* SAVE: a device sends its updated habits to be stored */
app.post("/habits", (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
  res.json({ ok: true });
});

/* start the server and print the addresses you can open */
app.listen(PORT, () => {
  console.log("\nHabit tracker server is running!\n");
  console.log("  On THIS computer:  http://localhost:" + PORT);

  // find this machine's address on your home network (for your phone)
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log("  On your PHONE:     http://" + net.address + ":" + PORT);
      }
    }
  }
  console.log("\n(Phone must be on the same Wi-Fi. Press Ctrl+C to stop.)\n");
});
