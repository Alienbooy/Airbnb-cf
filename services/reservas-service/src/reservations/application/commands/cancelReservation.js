const { RESERVATION_STATUS } = require('../../domain/entities');
const { isAdmin, isGuestOwner, isHostOwner } = require('../../domain/policies');
const { AppError } = require('../errors');
const { changeReservationStatus } = require('./changeReservationStatus');

async function cancelReservation(id, user) {
  return changeReservationStatus(id, user, RESERVATION_STATUS.CANCELLED, (reservation) => {
    if (!isAdmin(user) && !isHostOwner(user, reservation) && !isGuestOwner(user, reservation)) {
      throw new AppError(403, 'forbidden', 'Only the guest, host or an admin can cancel this reservation');
    }

    if (!reservation.canBeCancelled()) {
      throw new AppError(409, 'invalid_status_transition', 'Reservation is already cancelled');
    }
  });
}

module.exports = {
  cancelReservation,
};
