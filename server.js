const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(express.static('public'));

// GET /tasks
app.get('/tasks', (req, res) => {
    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]);
            } else {
                return res.status(500).send('Error reading file');
            }
        }
        try {
            const tasks = JSON.parse(data || '[]');
            res.json(tasks);
        } catch (e) {
            res.status(500).send('Error parsing JSON');
        }
    });
});

// POST /tasks
app.post('/tasks', (req, res) => {
    fs.writeFile(TASKS_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).send('Error writing file');
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
