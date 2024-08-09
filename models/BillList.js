const mongoose = require("mongoose");

// Define a Mongoose schema and model
const billSchema = new mongoose.Schema({
    isIncome: Boolean,

    date_of_entry: String,
    tenant_name: String,
    stay_name: String,
    date_of_booking: [String, String],

    booking_from: String,
    room_no: String,

    adavance_amount: Number,
    balance_amount: Number,
    extra_amount: Number,
    extra_amount_detail: String,
    total_amount: Number,


    cash_received: Number,
    amount_received_in_gpay: Number,
    amount_received_in_account: Number,
    amount_credited_to: [String],
    currency_received: String,


    gst_transction: Boolean,
    broker_commission: Number,
    gst_amount: Number,
    tds_amount: Number,
    tcs_amount: Number,
    final_amount: Number,

    total_expense: Number,
    expense_date: String,
    expenses_explanation: String,
    debited_Amount: Number,
    amount_debited_from: String,
    expense_for: String,
    gst_amount_inward: Number,
    gst_transction_expense: Boolean,
});

module.exports = mongoose.model("Item", billSchema);
