const express = require("express");
const Currency = require("../models/Currency"); // No .js extension needed

const router = express.Router();

// Get all todos
router.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const newTodo = new Currency({
            name,
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const todos = await Currency.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const deletedTodo = await Currency.findByIdAndDelete(req.params.id);
        if (deletedTodo) {
            res.json({ message: "TODO item deleted" });
        } else {
            res.status(404).json({ message: "TODO item not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;