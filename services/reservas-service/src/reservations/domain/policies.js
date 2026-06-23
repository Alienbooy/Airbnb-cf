function isAdmin(user) {
  return user.role === 'admin';
}

function isHostOwner(user, reservation) {
  return user.role === 'host' && reservation.isOwnedByHost(user.id);
}

function isGuestOwner(user, reservation) {
  return reservation.isOwnedByGuest(user.id);
}

module.exports = {
  isAdmin,
  isGuestOwner,
  isHostOwner,
};
