const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)");
});

app.post('/items', (req, res) => {
  const { name, description } = req.body;
  db.run("INSERT INTO items (name, description) VALUES (?, ?)", [name, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, description });
  });
});

app.get('/items', (req, res) => {
  db.all("SELECT * FROM items", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/items/:id', (req, res) => {
  const { name, description } = req.body;
  db.run("UPDATE items SET name = ?, description = ? WHERE id = ?", [name, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item updated' });
  });
});

app.delete('/items/:id', (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
