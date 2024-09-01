const express = require("express");
const User = require("../models/User"); // No .js extension needed

const router = express.Router();

router.post("/check", async (req, res) => {
    const { name, password } = req.body;
    try {
        const todos = await User.find();
        const userFound = todos.find(d => d.name === name && d.password === password)
        if (userFound) {
            res.status(200).json(todos);
        } else {
            res.status(401).json({ user: "unathu" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/", async (req, res) => {
    const { name, password } = req.body;
    try {
        const newTodo = new User({
            name, password
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports = router;
