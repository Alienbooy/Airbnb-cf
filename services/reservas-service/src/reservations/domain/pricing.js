const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function calculateNights(fromDate, toDate) {
  const from = parseDateOnly(fromDate);
  const to = parseDateOnly(toDate);

  if (!from || !to) {
    return 0;
  }

  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function calculateTotal(nights, pricePerNight) {
  return Number((nights * Number(pricePerNight)).toFixed(2));
}

module.exports = {
  calculateNights,
  calculateTotal,
  parseDateOnly,
};
