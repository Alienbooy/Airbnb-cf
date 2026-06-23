const db = require('../../../config/db');
const reservationRepository = require('../../infrastructure/db/reservation.repository');
const { AppError } = require('../errors');

async function changeReservationStatus(id, user, status, validateTransition) {
  return db.transaction(async (client) => {
    const reservation = await reservationRepository.findById(id, client);

    if (!reservation) {
      throw new AppError(404, 'reservation_not_found', 'Reservation not found');
    }

    validateTransition(reservation);

    if (reservation.status === status) {
      return reservation;
    }

    return reservationRepository.updateStatus(id, status, client);
  });
}

module.exports = {
  changeReservationStatus,
};
