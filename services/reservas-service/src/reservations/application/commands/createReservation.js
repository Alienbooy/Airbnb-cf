const db = require('../../../config/db');
const { RESERVATION_STATUS } = require('../../domain/entities');
const { calculateNights, calculateTotal } = require('../../domain/pricing');
const reservationRepository = require('../../infrastructure/db/reservation.repository');
const { AppError } = require('../errors');

async function createReservation(payload, user) {
  const nights = calculateNights(payload.from_date, payload.to_date);
  const total = calculateTotal(nights, payload.price_per_night);

  return db.transaction(async (client) => {
    await client.query('SELECT pg_advisory_xact_lock($1)', [payload.listing_id]);

    const overlap = await reservationRepository.findOverlappingReservation(
      payload.listing_id,
      payload.from_date,
      payload.to_date,
      client,
    );

    if (overlap) {
      throw new AppError(
        409,
        'reservation_dates_unavailable',
        'The listing already has a pending or confirmed reservation for those dates',
        { reservation_id: overlap.id },
      );
    }

    return reservationRepository.createReservation(
      {
        ...payload,
        guest_id: user.id,
        nights,
        total,
        status: RESERVATION_STATUS.PENDING,
      },
      client,
    );
  });
}

module.exports = {
  createReservation,
};
