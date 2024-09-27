const express = require("express");
const Currency = require("../models/Customer"); // No .js extension needed

const router = express.Router();

// Get all todos
router.post("/", async (req, res) => {
    const { name, address, phone, checkIn, checkOut, file, dateOfEntry } = req.body;
    try {
        const newTodo = new Currency({
            name, address, phone, checkIn, checkOut, file, dateOfEntry
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
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedTodo = await Currency.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        // res.send(updatedTodo);
        const todos = await Currency.find();
        res.json(todos);
    } catch (error) {
        res.status(500).send('Error updating the todo item');
    }
});

module.exports = router;