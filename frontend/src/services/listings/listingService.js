import gateway from '../api/gateway';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

const STATUS_MAP = {
  APPROVED: 'active',
  PENDING: 'pending',
  REJECTED: 'rejected',
  INACTIVE: 'inactive',
  approved: 'active',
  pending: 'pending',
  rejected: 'rejected',
  inactive: 'inactive',
};

function normalizeStatus(status) {
  return STATUS_MAP[status] || String(status || 'pending').toLowerCase();
}

function valueFrom(listing, camelName, snakeName, fallback = '') {
  return listing[camelName] ?? listing[snakeName] ?? fallback;
}

function normalizeListing(listing) {
  const hostId = valueFrom(listing, 'hostId', 'host_id');
  const coverImage = valueFrom(listing, 'mainPhotoUrl', 'main_photo_url') || DEFAULT_IMAGE;
  const capacity = Number(valueFrom(listing, 'capacity', 'guests', 1));
  const pricePerNight = Number(valueFrom(listing, 'pricePerNight', 'price_per_night', 0));
  const city = listing.city || 'Sin ciudad';
  const type = listing.type || 'alojamiento';

  return {
    id: String(listing.id),
    hostId: hostId ? String(hostId) : '',
    slug: String(listing.id),
    title: listing.title || 'Alojamiento sin titulo',
    subtitle: type,
    description: listing.description || 'Este alojamiento aun no tiene una descripcion publicada.',
    city,
    country: 'Bolivia',
    address: valueFrom(listing, 'addressReference', 'address_reference', city),
    pricePerNight,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 0,
    coverImage,
    images: [coverImage],
    amenities: [],
    guests: capacity,
    bedrooms: 1,
    beds: Math.max(1, Math.ceil(capacity / 2)),
    baths: 1,
    status: normalizeStatus(listing.status),
    type,
    host: {
      id: hostId ? String(hostId) : '',
      firstName: 'Anfitrion',
      lastName: '',
      name: 'Anfitrion verificado',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80',
      superhost: false,
      responseRate: 95,
      responseTime: 'menos de 24 horas',
    },
  };
}

export const listingService = {
  async listListings(filters = {}) {
    const params = {};
    if (filters.city) params.city = filters.city;
    const response = await gateway.get('/api/listings', { params });
    return response.data.map(normalizeListing);
  },

  async getListing(id) {
    const response = await gateway.get(`/api/listings/${id}`);
    return normalizeListing(response.data);
  },

  async getHostListings() {
    const response = await gateway.get('/api/listings/host');
    return response.data.map(normalizeListing);
  },

  async getAdminListings() {
    const response = await gateway.get('/api/listings/admin');
    return response.data.map(normalizeListing);
  },

  async createListing(data) {
    const response = await gateway.post('/api/listings', {
      title: data.title,
      description: data.description,
      city: data.city,
      type: data.type || 'apartment',
      capacity: Number(data.guests || data.capacity || 1),
      pricePerNight: Number(data.pricePerNight),
      addressReference: data.address,
      mainPhotoUrl: data.images?.[0] || data.mainPhotoUrl || '',
    });
    return normalizeListing(response.data);
  },

  async approveListing(id) {
    const response = await gateway.post(`/api/admin/listings/${id}/moderate`, {
      action: 'APPROVE',
      reason: 'Aprobado desde el panel'
    });
    // Our node.js endpoint returns { message, log }, so we need to return the listing somehow or fetch it.
    // For the UI to update, we can just return the local status change.
    return { id, status: 'active' };
  },

  async rejectListing(id) {
    const response = await gateway.post(`/api/admin/listings/${id}/moderate`, {
      action: 'REJECT',
      reason: 'Rechazado desde el panel'
    });
    return { id, status: 'rejected' };
  },
};
