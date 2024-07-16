const express = require('express')
const Item = require('../models/BillList'); // No .js extension 

const routerBill = express.Router();

routerBill.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        const totalFinalAmount = items.reduce((total, item) => {
            return total + Number(item["Final_Amount"]);
        }, 0);
        res.json({ items: items, totalFinalAmount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// POST route to create a new bill
routerBill.post('/', async (req, res) => {
    const newItem = new Item(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {

        res.status(400).json({ err });
    }
});
routerBill.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (updatedItem) {
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = routerBill
