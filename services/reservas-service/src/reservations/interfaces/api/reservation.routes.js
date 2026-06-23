const { Router } = require('express');
const authenticate = require('../../../middlewares/auth.middleware');
const { requireRole } = require('../../../middlewares/role.middleware');
const reservationController = require('./reservation.controller');

const router = Router();

router.post('/', authenticate, requireRole('guest'), reservationController.createReservation);
router.get('/my', authenticate, requireRole('guest'), reservationController.getMyReservations);
router.get('/host', authenticate, requireRole('host'), reservationController.getHostReservations);
router.get('/', authenticate, requireRole('admin'), reservationController.getAllReservations);
router.patch('/:id/confirm', authenticate, reservationController.confirmReservation);
router.patch('/:id/cancel', authenticate, reservationController.cancelReservation);
router.patch('/:id/reject', authenticate, reservationController.rejectReservation);

module.exports = router;
