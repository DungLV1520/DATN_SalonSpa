const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const {
  getAllBook,
  createNewBooking,
  updateBookingUser,
  updateBookingAdmin,
  deleteBooking,
  getBookingByUser,
  cancelBookingByUser,
} = require('../controllers/booking.controller');

router
  .route('/')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.MGMT, typeRole.EMP]),
    asyncMiddleware(getAllBook),
  )
  .post(asyncMiddleware(authMiddleware), asyncMiddleware(createNewBooking));

router
  .route('/:id')
  .patch(asyncMiddleware(authMiddleware), asyncMiddleware(updateBookingUser))
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deleteBooking),
  );

router
  .route('/my_booking')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getBookingByUser));

router
  .route('/cancel/:id')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(cancelBookingByUser));

router
  .route('/is_come/:id')
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(updateBookingAdmin),
  );
module.exports = router;
