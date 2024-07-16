const mongoose = require('mongoose');

// Define a Mongoose schema and model
const billSchema = new mongoose.Schema({
    "Income_From_(Stay_Name)": {
        type: String,
        required: [true, 'Income From (Stay Name) is required'],
    },
    "Date_Of_Booking": {
        type: String,
        required: [true, 'Date Of Booking is required'],
    },
    "Tenant_Name": {
        type: String,
        required: [true, 'Tenant Name is required'],
    },
    "Booking_From": {
        type: String,
        required: [true, 'Booking From is required'],
    },
    "Room_No": String,
    "Share_Percentage": {
        type: Number,
        required: [true, 'Share Percentage is required'],
        validate: {
            validator: function (value) {
                return value !== 0; // Custom validation function
            },
            message: props => `${props.value} is not a valid age! Age cannot be 0.`
        }
    },
    "Balance_Amount": {
        type: Number,
        required: [true, 'Balance Amount is required'],
        validate: {
            validator: function (value) {
                return value !== 0; // Custom validation function
            },
            message: props => `${props.value} cannot be zero`
        }
    },
    "Adavance_Amount": Number,
    "Extra_Amount": Number,
    "Extra_Amount_Detail": String,
    "Expenses": {
        type: Number,
        required: [true, 'Expenses is required'],
    },
    "Expenses_Explanation": String,
    "Debited_Amount": Number,
    "Amount_Debited_from": String,
    "Amount_Credited_to": String,
    "Credited_Amount": Number,
    "Amount_Received_As_(Rs_/_Euro)": String,
    "Is_GST_Included": {
        type: Boolean,
        required: [true, 'Is GST Included is required'],
    },
    "GST_Percentage": {
        type: Number,
        required: [true, 'GST Percentage is required'],
        validate: {
            validator: function (value) {
                if (this.Is_GST_Included) {
                    return value !== 0;
                } // Custom validation function
            },
            message: props => `GST Percentage cant be ${props.value}.`
        }
    },
    "Final_Amount": {
        type: Number,
        required: [true, 'Final Amount is required'],
        validate: {
            validator: function (value) {
                return value !== 0; // Custom validation function
            },
            message: props => `${props.value} cannot be zero`
        }
    },
});

module.exports = mongoose.model('Item', billSchema);

