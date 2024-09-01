const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routerBill = require('./routes/route_billList'); // No .js extension needed
const routerCurrency = require('./routes/route_currency')
const routerSource = require('./routes/route_source')
const routerHotel = require('./routes/route_hotel')
const routerAccount = require('./routes/route_accounts')
const routerLogin = require('./routes/route_user')
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string
// const dbUri = 'mongodb+srv://dharshan:dharshan@cluster0.x88jkfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbUri = process.env.DB_PASS

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/login', routerLogin);
app.use('/bill', routerBill);
app.use('/source', routerSource);
app.use('/hotel', routerHotel);
app.use('/currency', routerCurrency);
app.use('/account', routerAccount);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
