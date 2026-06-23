const cors = require('cors');
const express = require('express');
const { AppError } = require('./reservations/application/errors');
const reservationRoutes = require('./reservations/interfaces/api/reservation.routes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'reservations-service' });
});

app.use('/api/reservations', reservationRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: 'Route not found',
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: 'internal_error',
    message: 'Internal server error',
  });
});

module.exports = app;
