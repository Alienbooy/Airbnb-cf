const RESERVATION_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
});

class ReservationEntity {
  constructor(data) {
    this.id = data.id;
    this.listing_id = data.listing_id;
    this.guest_id = data.guest_id;
    this.host_id = data.host_id;
    this.from_date = data.from_date;
    this.to_date = data.to_date;
    this.nights = data.nights;
    this.price_per_night = data.price_per_night;
    this.total = data.total;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  isOwnedByGuest(userId) {
    return this.guest_id === userId;
  }

  isOwnedByHost(userId) {
    return this.host_id === userId;
  }

  canBeConfirmed() {
    return ![RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.REJECTED].includes(this.status);
  }

  canBeCancelled() {
    return this.status !== RESERVATION_STATUS.CANCELLED;
  }

  canBeRejected() {
    return ![RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.CANCELLED].includes(this.status);
  }

  toJSON() {
    return {
      id: this.id,
      listing_id: this.listing_id,
      guest_id: this.guest_id,
      host_id: this.host_id,
      from_date: this.from_date,
      to_date: this.to_date,
      nights: this.nights,
      price_per_night: this.price_per_night,
      total: this.total,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

function buildReservationEntity(data) {
  if (!data) {
    return null;
  }
  return new ReservationEntity(data);
}

module.exports = {
  RESERVATION_STATUS,
  ReservationEntity,
  buildReservationEntity,
};
