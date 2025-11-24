const mongoose = require("mongoose");

// Define a Mongoose schema and model
const billSchema = new mongoose.Schema({
    // Basic Information
    isIncome: Boolean,
    date_of_entry: String,
    tenant_name: String,
    stay_name: String,
    room_no: String,
    booking_from: String,
    date_of_booking: [String],
    
    // Transaction Details
    gst_transction: Boolean,
    total_without_taxes: Number,
    tax_slab: Number,
    
    // Calculated Amounts
    totalTaxAmount: Number,        // Tax Amount (GST)
    totalWithTaxes: Number,         // Total with Taxes
    
    // Commission Details
    commission_amount: Number,
    commission_percentage: Number,
    commission_amount_gst: Number,
    total_commission_amount: Number,
    
    // Tax Deductions
    tcs_amount: Number,
    tds_amount: Number,
    
    // Final Calculations
    net_profit: Number,
    
    // Credit Distribution
    creditedAccounts: [{
        account: String,
        amount: Number
    }]
});

module.exports = mongoose.model("Itemsv2", billSchema);
