const express = require("express");
const Helper = require("../models/Hotel"); // No .js extension needed
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Get all todos
router.post("/", async (req, res) => {
    try {
        const { name, rooms = []
        } = req.body;

        const hotelRooms = rooms.length > 0 ? rooms?.map(room => ({
            name: room.name,
            _id: new mongoose.Types.ObjectId(),
        })) : [];

        const newTodo = new Helper({
            name, rooms: hotelRooms
        });
        const savedTodo = await newTodo.save();


        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const todos = await Helper.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const deletedTodo = await Helper.findByIdAndDelete(req.params.id);
        if (deletedTodo) {
            res.json({ message: "TODO item deleted" });
        } else {
            res.status(404).json({ message: "TODO item not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Delete a specific room by its _id
router.delete('/:hotelId/rooms/:roomId', async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;
        // Find the hotel and remove the room with the specified roomId
        const updatedHotel = await Helper.findByIdAndUpdate(
            hotelId,
            { $pull: { rooms: { _id: roomId } } },
            { new: true }
        );

        if (updatedHotel) {
            res.status(200).json({ message: 'Room deleted successfully', updatedHotel });
        } else {
            res.status(404).json({ message: 'Hotel or Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Update hotel details or add a new room
router.put('/:id', async (req, res) => {
    try {
        const { name, room } = req.body;

        // Update hotel name if provided
        const updateFields = {};
        if (name) updateFields.name = name;

        // Add a new room if provided
        if (room) {
            updateFields.$push = { rooms: { name: room.name, _id: new mongoose.Types.ObjectId() } };
        }

        const updatedHotel = await Helper.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (updatedHotel) {
            const todos = await Helper.find();
            // res.json(todos);
            res.status(200).json(todos);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//rename the room
router.put('/:hotelId/rooms/:roomId', async (req, res) => {
    const { hotelId, roomId } = req.params;
    const { name } = req.body;

    try {
        const hotel = await Helper.findOneAndUpdate(
            { _id: hotelId, "rooms._id": roomId },
            { $set: { "rooms.$.name": name } },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel or room not found' });
        }

        const todos = await Helper.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error updating room name', error });
    }
});





module.exports = router;
