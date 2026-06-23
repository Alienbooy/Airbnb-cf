const reservationRepository = require('../../infrastructure/db/reservation.repository');

function getMyReservations(user) {
  return reservationRepository.findByGuestId(user.id);
}

function getHostReservations(user) {
  return reservationRepository.findByHostId(user.id);
}

function getAllReservations() {
  return reservationRepository.findAll();
}

module.exports = {
  getAllReservations,
  getHostReservations,
  getMyReservations,
};
