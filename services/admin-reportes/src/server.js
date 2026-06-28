require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./infrastructure/database');
const { connectKafka } = require('./infrastructure/kafka/producer');
const routes = require('./infrastructure/http/routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'admin-reportes' }));

// Routes
app.use('/api/admin', routes);

const PORT = process.env.PORT || 8082;

const startServer = async () => {
    // 1. Connect to DB
    await connectDB();
    // 2. Connect to Kafka
    await connectKafka();
    
    // 3. Start Express server
    app.listen(PORT, () => {
        console.log(`Admin-Reportes microservice running on port ${PORT}`);
    });
};

startServer();
