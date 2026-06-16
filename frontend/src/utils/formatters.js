export function money(value, currency = 'USD') {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseDate(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  return new Date(value);
}

export function shortDate(value) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseDate(value));
}

export function compactDate(value) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
  }).format(parseDate(value));
}

export function statusLabel(value) {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    confirmed: 'Confirmada',
    checked_in: 'Check-in',
    completed: 'Completada',
    cancelled: 'Cancelada',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
    open: 'Abierto',
    closed: 'Cerrado',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    booked: 'Reservado',
  };

  return labels[value] || value;
}

export function amenityLabel(value) {
  const labels = {
    wifi: 'Wifi',
    airConditioning: 'Aire acondicionado',
    kitchen: 'Cocina',
    washer: 'Lavadora',
    workspace: 'Espacio de trabajo',
    balcony: 'Balcon',
    pool: 'Piscina',
    parking: 'Estacionamiento',
    breakfast: 'Desayuno',
    seaView: 'Vista al mar',
    fireplace: 'Chimenea',
    lakeView: 'Vista al lago',
    grill: 'Parrilla',
    security: 'Seguridad',
    patio: 'Patio',
    gym: 'Gimnasio',
    terrace: 'Terraza',
  };

  return labels[value] || value;
}

export function nightsBetween(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / 86400000));
}
