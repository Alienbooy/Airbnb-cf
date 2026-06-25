import gateway from '../api/gateway';

function field(reservation, snakeName, camelName, fallback = '') {
  return reservation[snakeName] ?? reservation[camelName] ?? fallback;
}

function normalizeReservation(reservation, listings = []) {
  const listingId = String(field(reservation, 'listing_id', 'listingId'));
  const listing = listings.find((item) => item.id === listingId);
  const status = String(reservation.status || 'pending').toLowerCase();
  const total = Number(field(reservation, 'total', 'total', 0));

  let paymentStatus = 'pending';
  if (['confirmed', 'completed'].includes(status)) paymentStatus = 'paid';
  if (['cancelled', 'rejected'].includes(status)) paymentStatus = 'refunded';

  return {
    id: String(reservation.id),
    listingId,
    guestId: String(field(reservation, 'guest_id', 'guestId')),
    hostId: String(field(reservation, 'host_id', 'hostId')),
    guestName: 'Huesped',
    listingTitle: listing?.title || `Alojamiento ${listingId}`,
    city: listing?.city || '',
    coverImage: listing?.coverImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    checkIn: field(reservation, 'from_date', 'fromDate'),
    checkOut: field(reservation, 'to_date', 'toDate'),
    guests: listing?.guests || 1,
    nights: Number(reservation.nights || 0),
    subtotal: total,
    serviceFee: 0,
    cleaningFee: 0,
    taxes: 0,
    total,
    currency: 'USD',
    status,
    paymentStatus,
    createdAt: field(reservation, 'created_at', 'createdAt'),
  };
}

export const reservationService = {
  async createReservation(data) {
    const response = await gateway.post('/api/reservations', {
      listing_id: data.listingId,
      host_id: data.hostId,
      from_date: data.checkIn,
      to_date: data.checkOut,
      price_per_night: Number(data.pricePerNight),
    });
    return normalizeReservation(response.data);
  },

  async getMyReservations(listings = []) {
    const response = await gateway.get('/api/reservations/my');
    return response.data.map((reservation) => normalizeReservation(reservation, listings));
  },

  async getHostReservations(listings = []) {
    const response = await gateway.get('/api/reservations/host');
    return response.data.map((reservation) => normalizeReservation(reservation, listings));
  },

  async getAllReservations(listings = []) {
    const response = await gateway.get('/api/reservations');
    return response.data.map((reservation) => normalizeReservation(reservation, listings));
  },

  async confirmReservation(id) {
    const response = await gateway.patch(`/api/reservations/${id}/confirm`);
    return normalizeReservation(response.data);
  },

  async cancelReservation(id) {
    const response = await gateway.patch(`/api/reservations/${id}/cancel`);
    return normalizeReservation(response.data);
  },

  async rejectReservation(id) {
    const response = await gateway.patch(`/api/reservations/${id}/reject`);
    return normalizeReservation(response.data);
  },
};
