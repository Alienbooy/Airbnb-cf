CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL,
  guest_id INTEGER NOT NULL,
  host_id INTEGER NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reservations_status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rejected')),
  CONSTRAINT reservations_dates_check CHECK (from_date < to_date),
  CONSTRAINT reservations_nights_check CHECK (nights > 0),
  CONSTRAINT reservations_price_check CHECK (price_per_night > 0),
  CONSTRAINT reservations_total_check CHECK (total > 0)
);

CREATE INDEX IF NOT EXISTS idx_reservations_listing_active_dates
  ON reservations (listing_id, from_date, to_date)
  WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_reservations_guest_id
  ON reservations (guest_id);

CREATE INDEX IF NOT EXISTS idx_reservations_host_id
  ON reservations (host_id);

CREATE OR REPLACE FUNCTION update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reservations_updated_at ON reservations;

CREATE TRIGGER trg_reservations_updated_at
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_reservations_updated_at();
