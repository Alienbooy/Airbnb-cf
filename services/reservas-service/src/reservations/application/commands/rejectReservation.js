const { RESERVATION_STATUS } = require('../../domain/entities');
const { isAdmin, isHostOwner } = require('../../domain/policies');
const { AppError } = require('../errors');
const { changeReservationStatus } = require('./changeReservationStatus');

async function rejectReservation(id, user) {
  return changeReservationStatus(id, user, RESERVATION_STATUS.REJECTED, (reservation) => {
    if (!isAdmin(user) && !isHostOwner(user, reservation)) {
      throw new AppError(403, 'forbidden', 'Only the reservation host or an admin can reject this reservation');
    }

    if (!reservation.canBeRejected()) {
      throw new AppError(409, 'invalid_status_transition', 'Confirmed or cancelled reservations cannot be rejected');
    }
  });
}

module.exports = {
  rejectReservation,
};
