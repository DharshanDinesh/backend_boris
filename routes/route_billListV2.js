const express = require('express');
const Item = require('../models/BillListV2');

const routerBillV2 = express.Router();

// Helper function to parse DD/MM/YYYY date string to Date object
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
};

// Helper function to compare dates in DD/MM/YYYY format
const isDateInRange = (dateStr, startStr, endStr) => {
    if (!dateStr || !startStr || !endStr) return true;
    const date = parseDate(dateStr);
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    return date >= start && date <= end;
};

// GET all bills with filtering, sorting, and pagination
routerBillV2.get('/', async (req, res) => {
    try {
        const { 
            page = 1,
            limit = 10,
            startDateEntry,
            endDateEntry,
            startDateBooking,
            endDateBooking,
            stay_name,
            booking_from,
            isIncome,
            gst_transction,
            sortBy = 'date_of_entry',
            order = 'desc'
        } = req.query;

        // Parse pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let query = {};

        // Income/Expense filter
        if (isIncome !== undefined && isIncome !== null && isIncome !== '') {
            query.isIncome = isIncome === 'true' || isIncome === true;
        }

        // GST Transaction filter
        if (gst_transction !== undefined && gst_transction !== null && gst_transction !== '') {
            query.gst_transction = gst_transction === 'true' || gst_transction === true;
        }

        // Stay name filter (supports multiple values)
        if (stay_name) {
            const stays = Array.isArray(stay_name) ? stay_name : stay_name.split(',');
            query.stay_name = { $in: stays };
        }

        // Booking source filter (supports multiple values)
        if (booking_from) {
            const sources = Array.isArray(booking_from) ? booking_from : booking_from.split(',');
            query.booking_from = { $in: sources };
        }

        // Fetch all matching documents for date filtering
        let items = await Item.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

        // Apply date filters in JavaScript (since dates are stored as strings in DD/MM/YYYY format)
        if (startDateEntry && endDateEntry) {
            items = items.filter(item => 
                isDateInRange(item.date_of_entry, startDateEntry, endDateEntry)
            );
        }

        if (startDateBooking && endDateBooking) {
            items = items.filter(item => {
                if (!item.date_of_booking || !Array.isArray(item.date_of_booking)) return false;
                
                // Check if any date in booking range overlaps with filter range
                const bookingStart = item.date_of_booking[0];
                const bookingEnd = item.date_of_booking[1] || bookingStart;
                
                const filterStart = parseDate(startDateBooking);
                const filterEnd = parseDate(endDateBooking);
                const itemStart = parseDate(bookingStart);
                const itemEnd = parseDate(bookingEnd);
                
                // Check for overlap: item starts before filter ends AND item ends after filter starts
                return itemStart <= filterEnd && itemEnd >= filterStart;
            });
        }

        // Calculate total values from filtered results
        const totalNetProfit = items.reduce((total, item) => {
            return total + Number(item.net_profit || 0);
        }, 0);

        const totalCount = items.length;

        // Apply pagination
        const paginatedItems = items.slice(skip, skip + limitNum);

        res.json({ 
            items: paginatedItems,
            totalNetProfit,
            count: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
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
