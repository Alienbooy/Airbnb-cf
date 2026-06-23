const { RESERVATION_STATUS } = require('../../domain/entities');
const { isAdmin, isHostOwner } = require('../../domain/policies');
const { AppError } = require('../errors');
const { changeReservationStatus } = require('./changeReservationStatus');

async function confirmReservation(id, user) {
  return changeReservationStatus(id, user, RESERVATION_STATUS.CONFIRMED, (reservation) => {
    if (!isAdmin(user) && !isHostOwner(user, reservation)) {
      throw new AppError(403, 'forbidden', 'Only the reservation host or an admin can confirm this reservation');
    }

    if (!reservation.canBeConfirmed()) {
      throw new AppError(409, 'invalid_status_transition', 'Cancelled or rejected reservations cannot be confirmed');
    }
  });
}

module.exports = {
  confirmReservation,
};
