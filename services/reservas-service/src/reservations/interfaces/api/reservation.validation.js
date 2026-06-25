const { z } = require('zod');
const { parseDateOnly } = require('../../domain/pricing');

function isValidDateOnly(value) {
  const date = parseDateOnly(value);
  return Boolean(date && date.toISOString().slice(0, 10) === value);
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function compareDateOnly(left, right) {
  return parseDateOnly(left).getTime() - parseDateOnly(right).getTime();
}

function isPastDate(value) {
  return parseDateOnly(value).getTime() < todayUtc().getTime();
}

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const dateSchema = z
  .string({ required_error: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format')
  .refine(isValidDateOnly, 'Date must be valid');

const createReservationSchema = z
  .object({
    listing_id: z.string().uuid(),
    host_id: z.string().uuid(),
    from_date: dateSchema,
    to_date: dateSchema,
    price_per_night: z.coerce.number().finite().positive(),
  })
  .superRefine((value, ctx) => {
    if (!isValidDateOnly(value.from_date) || !isValidDateOnly(value.to_date)) {
      return;
    }

    if (compareDateOnly(value.from_date, value.to_date) >= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['to_date'],
        message: 'to_date must be after from_date',
      });
    }

    if (isPastDate(value.from_date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['from_date'],
        message: 'from_date cannot be in the past',
      });
    }
  });

function formatValidationError(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

module.exports = {
  createReservationSchema,
  formatValidationError,
  idSchema,
};
