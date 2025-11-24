const express = require('express');
const Item = require('../models/BillListV2');

const routerBillV2 = express.Router();

// GET all bills with filtering and sorting options
routerBillV2.get('/', async (req, res) => {
    try {
        const { 
            startDate, 
            endDate, 
            stay_name, 
            booking_from,
            sortBy = 'date_of_entry',
            order = 'desc'
        } = req.query;

        let query = {};

        // Date range filter
        if (startDate && endDate) {
            query.date_of_entry = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // Stay name filter
        if (stay_name) {
            query.stay_name = stay_name;
        }

        // Booking source filter
        if (booking_from) {
            query.booking_from = booking_from;
        }

        const items = await Item.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

        const totalNetProfit = items.reduce((total, item) => {
            return total + Number(item.net_profit || 0);
        }, 0);

        res.json({ 
            items,
            totalNetProfit,
            count: items.length
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching bills", 
            error: err.message 
        });
    }
});

// GET single bill by ID
routerBillV2.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching bill", 
            error: err.message 
        });
    }
});

// POST route to create a new bill
routerBillV2.post('/', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'tenant_name', 
            'stay_name', 
            'room_no', 
            'booking_from',
            'date_of_booking',
            'total_without_taxes',
            'creditedAccounts'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                fields: missingFields 
            });
        }

        // Validate credited amounts sum equals net profit
        const totalCredited = req.body.creditedAccounts.reduce(
            (sum, account) => sum + Number(account.amount), 
            0
        );

        if (Math.abs(totalCredited - req.body.net_profit) > 0.01) {
            return res.status(400).json({
                message: "Total credited amount must equal net profit",
                creditedTotal: totalCredited,
                netProfit: req.body.net_profit
            });
        }

        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({
            message: "Error creating bill",
            error: err.message
        });
    }
});

// PUT route to update a bill
routerBillV2.put('/:id', async (req, res) => {
    try {
        // Validate credited amounts if provided
        if (req.body.creditedAccounts && req.body.net_profit) {
            const totalCredited = req.body.creditedAccounts.reduce(
                (sum, account) => sum + Number(account.amount), 
                0
            );

            if (Math.abs(totalCredited - req.body.net_profit) > 0.01) {
                return res.status(400).json({
                    message: "Total credited amount must equal net profit",
                    creditedTotal: totalCredited,
                    netProfit: req.body.net_profit
                });
            }
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({
            message: "Error updating bill",
            error: err.message
        });
    }
});

// DELETE route to remove a bill
routerBillV2.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json({ 
            message: "Bill successfully deleted",
            deletedItem
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting bill",
            error: err.message
        });
    }
});


module.exports = routerBillV2
