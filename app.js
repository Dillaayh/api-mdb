const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

const akunRoutes = require('./routes/akunRoutes');
const hewanRoutes = require('./routes/hewanRoutes');
const kesehatanRoutes = require('./routes/kesehatanRoutes');

app.use('/api/akun', akunRoutes);
app.use('/api/hewan', hewanRoutes);
app.use('/api/kesehatan', kesehatanRoutes);

module.exports = app;
