const db = require('../../../config/db');
const { buildReservationEntity } = require('../../domain/entities');

function executor(client) {
  return client || db;
}

function normalizeReservation(row) {
  if (!row) {
    return null;
  }

  return buildReservationEntity({
    ...row,
    price_per_night: Number(row.price_per_night),
    total: Number(row.total),
    from_date: normalizeDate(row.from_date),
    to_date: normalizeDate(row.to_date),
    created_at: normalizeDateTime(row.created_at),
    updated_at: normalizeDateTime(row.updated_at),
  });
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

function normalizeDateTime(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

async function createReservation(data, client) {
  const result = await executor(client).query(
    `INSERT INTO reservations (
      listing_id,
      guest_id,
      host_id,
      from_date,
      to_date,
      nights,
      price_per_night,
      total,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      data.listing_id,
      data.guest_id,
      data.host_id,
      data.from_date,
      data.to_date,
      data.nights,
      data.price_per_night,
      data.total,
      data.status,
    ],
  );

  return normalizeReservation(result.rows[0]);
}

async function findOverlappingReservation(listingId, fromDate, toDate, client, excludeReservationId = null) {
  const params = [listingId, fromDate, toDate];
  let excludeClause = '';

  if (excludeReservationId) {
    params.push(excludeReservationId);
    excludeClause = `AND id <> $${params.length}`;
  }

  const result = await executor(client).query(
    `SELECT *
     FROM reservations
     WHERE listing_id = $1
       AND status IN ('pending', 'confirmed')
       AND from_date < $3::date
       AND to_date > $2::date
       ${excludeClause}
     ORDER BY from_date ASC
     LIMIT 1`,
    params,
  );

  return normalizeReservation(result.rows[0]);
}

async function findById(id, client) {
  const result = await executor(client).query(
    `SELECT *
     FROM reservations
     WHERE id = $1`,
    [id],
  );

  return normalizeReservation(result.rows[0]);
}

async function findByGuestId(guestId) {
  const result = await db.query(
    `SELECT *
     FROM reservations
     WHERE guest_id = $1
     ORDER BY created_at DESC`,
    [guestId],
  );

  return result.rows.map(normalizeReservation);
}

async function findByHostId(hostId) {
  const result = await db.query(
    `SELECT *
     FROM reservations
     WHERE host_id = $1
     ORDER BY created_at DESC`,
    [hostId],
  );

  return result.rows.map(normalizeReservation);
}

async function findAll() {
  const result = await db.query(
    `SELECT *
     FROM reservations
     ORDER BY created_at DESC`,
  );

  return result.rows.map(normalizeReservation);
}

async function updateStatus(id, status, client) {
  const result = await executor(client).query(
    `UPDATE reservations
     SET status = $2
     WHERE id = $1
     RETURNING *`,
    [id, status],
  );

  return normalizeReservation(result.rows[0]);
}

module.exports = {
  createReservation,
  findAll,
  findByGuestId,
  findByHostId,
  findById,
  findOverlappingReservation,
  updateStatus,
};
