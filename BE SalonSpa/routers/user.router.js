const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const {
  getAllAccount,
  register,
  login,
  updateAccount,
  deleteAcc,
  findById,
  resendVerifyCode,
  verifyCode,
  forgotPassword,
  resetPassword,
  getProfile,
  updatePass,
  updateProfile,
  verifyOtpUpdateProfile,
  resendVerifyOtpUpdateProfile,
  handleTokenAuthFirebase,
} = require('../controllers/user.controller');

router
  .route('/')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.MGMT, typeRole.EMP]),
    asyncMiddleware(getAllAccount),
  )
  .post(asyncMiddleware(register));

router
  .route('/profile')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getProfile));

router
  .route('/:id')
  .patch(asyncMiddleware(authMiddleware), asyncMiddleware(updateAccount))
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deleteAcc),
  )
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(findById));

router.route('/login').post(asyncMiddleware(login));

router.route('/login-firebase').post(asyncMiddleware(handleTokenAuthFirebase));

router.route('/resend-code').post(asyncMiddleware(resendVerifyCode));

router.route('/verify-code').post(asyncMiddleware(verifyCode));

router.route('/forgot').post(asyncMiddleware(forgotPassword));

router.route('/reset').post(asyncMiddleware(resetPassword));

router
  .route('/change-pass')
  .post(asyncMiddleware(authMiddleware), asyncMiddleware(updatePass));

router
  .route('/change-profile')
  .post(asyncMiddleware(authMiddleware), asyncMiddleware(updateProfile));

router
  .route('/verify-otp-profile')
  .post(
    asyncMiddleware(authMiddleware),
    asyncMiddleware(verifyOtpUpdateProfile),
  );

router
  .route('/resend-otp-profile')
  .post(
    asyncMiddleware(authMiddleware),
    asyncMiddleware(resendVerifyOtpUpdateProfile),
  );

module.exports = router;
