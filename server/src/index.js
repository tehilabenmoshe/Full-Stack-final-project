const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users.routes'));
//app.use('/api/restaurants', require('./routes/restaurants'));
//app.use('/api/menu', require('./routes/menu'));
//app.use('/api/cart', require('./routes/cart'));
//app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Click2Eat API running on http://localhost:${PORT}`));
