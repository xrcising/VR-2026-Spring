const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('./models/User.js');

const app = express();
const PORT = 2026;

mongoose.connect("mongodb://127.0.0.1:2027/XRcisingDB?directConnection=true", {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
})
    .then(() => console.log("Connected to MongoDB: XRcisingDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Auth ──────────────────────────────────────────────────────────

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password required' });
    if (password.length < 8)
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    try {
        if (await User.findOne({ username }))
            return res.status(409).json({ error: 'Username already taken' });
        const hash = await bcrypt.hash(password, 10);
        await new User({ username, password: hash }).save();
        res.status(201).json({ message: 'Account created', username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password required' });
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: 'Invalid username or password' });
        res.json({ message: 'Login successful', username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ── User profile ─────────────────────────────────────────────────

app.get('/api/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.put('/api/user/:username', async (req, res) => {
    const allowed = ['displayName', 'bio', 'avatarColor'];
    const update = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { $set: update },
            { new: true, select: '-password' }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.put('/api/user/:username/password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!(await bcrypt.compare(currentPassword, user.password)))
            return res.status(401).json({ error: 'Current password is incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.delete('/api/user/:username', async (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: 'Incorrect password' });
        await User.deleteOne({ username: req.params.username });
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ── WebSocket (required so client.js can assign clientID) ────────

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

let wsIndex = 100;
const clients = new Map();

function broadcastClientList() {
    const list = Array.from(clients.keys());
    const msg = JSON.stringify({ global: 'clients', value: list });
    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) ws.send(msg);
    });
}

wss.on('connection', (ws) => {
    const id = wsIndex++;
    ws.clientID = id;
    clients.set(id, ws);
    broadcastClientList();

    ws.on('message', (data) => {
        clients.forEach((other, otherId) => {
            if (otherId !== id && other.readyState === WebSocket.OPEN)
                other.send(data.toString());
        });
    });

    ws.on('close', () => { clients.delete(id); broadcastClientList(); });
    ws.on('error', () => ws.terminate());
});

httpServer.listen(PORT, () => console.log(`XRcising server running at http://localhost:${PORT}/xrcising/`));
