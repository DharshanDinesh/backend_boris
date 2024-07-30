const mongoose = require("mongoose");

// Define a Mongoose schema and model
const billSchema = new mongoose.Schema({
    isIncome: {
        type: Boolean,
    },

    tenant_name: {
        type: String,
    },
    stay_name: {
        type: String,

    },
    date_of_booking: {
        type: [String, String],
    },
    booking_from: {
        type: String,
    },
    room_no: String,
    share_percentage: {
        type: Number,
    },
    adavance_amount: Number,
    balance_amount: {
        type: Number,
    },
    extra_amount: Number,
    extra_amount_detail: String,
    total_amount: Number,

    is_cash_received: Boolean,
    amount_credited_to: String,
    credited_amount: Number,
    currency_received: String,

    gst_transction: {
        type: Boolean,
    },
    gst_percentage: {
        type: Number,
    },
    gst_amount: Number,
    tds_amount: Number,
    tcs_amount: Number,
    final_amount: Number,
    final_amount_after_share: Number,

    total_expense: {
        type: Number,
    },
    expense_date: String,
    expenses_explanation: String,
    debited_Amount: Number,
    amount_debited_from: String,
    expense_for: String,
    gst_amount_inward: Number,
    gst_transction_expense: Boolean,
});

module.exports = mongoose.model("Item", billSchema);
