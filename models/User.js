const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },   // seconds
    calories: { type: Number, default: 0 }
}, { _id: false });

const gameStatsSchema = new mongoose.Schema({
    totalSessions: { type: Number, default: 0 },
    totalCalories:  { type: Number, default: 0 },
    totalTime:      { type: Number, default: 0 },  // seconds
    highScore:      { type: Number, default: 0 },
    globalRank:     { type: Number, default: null },
    recentSessions: { type: [sessionSchema], default: [] }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username:    { type: String, required: true, unique: true, trim: true },
    password:    { type: String, required: true },
    displayName: { type: String, trim: true, default: '' },
    bio:         { type: String, default: '' },
    avatarColor: { type: String, default: '#c44dff' },
    stats: {
        xrcising:       { type: gameStatsSchema, default: () => ({}) },
        fitnessStudio:  { type: gameStatsSchema, default: () => ({}) },
        dancingMachine: { type: gameStatsSchema, default: () => ({}) }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
