const { cancelReservation } = require('../../application/commands/cancelReservation');
const { confirmReservation } = require('../../application/commands/confirmReservation');
const { createReservation } = require('../../application/commands/createReservation');
const { rejectReservation } = require('../../application/commands/rejectReservation');
const {
  getAllReservations,
  getHostReservations,
  getMyReservations,
} = require('../../application/queries/getReservations');
const {
  createReservationSchema,
  formatValidationError,
  idSchema,
} = require('./reservation.validation');

function parseOrRespond(schema, data, res) {
  const result = schema.safeParse(data);

  if (!result.success) {
    res.status(400).json({
      error: 'validation_error',
      message: 'Invalid request data',
      details: formatValidationError(result.error),
    });
    return null;
  }

  return result.data;
}

async function createReservationHandler(req, res, next) {
  try {
    const payload = parseOrRespond(createReservationSchema, req.body, res);
    if (!payload) return;

    const reservation = await createReservation(payload, req.user);
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
}

async function getMyReservationsHandler(req, res, next) {
  try {
    const reservations = await getMyReservations(req.user);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
}

async function getHostReservationsHandler(req, res, next) {
  try {
    const reservations = await getHostReservations(req.user);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
}

async function getAllReservationsHandler(_req, res, next) {
  try {
    const reservations = await getAllReservations();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
}

async function confirmReservationHandler(req, res, next) {
  try {
    const params = parseOrRespond(idSchema, req.params, res);
    if (!params) return;

    const reservation = await confirmReservation(params.id, req.user);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
}

async function cancelReservationHandler(req, res, next) {
  try {
    const params = parseOrRespond(idSchema, req.params, res);
    if (!params) return;

    const reservation = await cancelReservation(params.id, req.user);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
}

async function rejectReservationHandler(req, res, next) {
  try {
    const params = parseOrRespond(idSchema, req.params, res);
    if (!params) return;

    const reservation = await rejectReservation(params.id, req.user);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  cancelReservation: cancelReservationHandler,
  confirmReservation: confirmReservationHandler,
  createReservation: createReservationHandler,
  getAllReservations: getAllReservationsHandler,
  getHostReservations: getHostReservationsHandler,
  getMyReservations: getMyReservationsHandler,
  rejectReservation: rejectReservationHandler,
};
