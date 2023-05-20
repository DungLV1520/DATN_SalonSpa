const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');
const {
  getAllBill,
  getAllMyBill,
  getDetailBill,
  createBill,
  deleteBill,
  handleBillStatus,
  createBillPaypal,
  paymentEvents,
  getBillsByBranchId,
} = require('../controllers/bill.controller');

router
  .route('/')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(getAllBill),
  )
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.EMP, typeRole.MGMT]),
    asyncMiddleware(createBill),
  );

router
  .route('/my_bill')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.USER, typeRole.EMP]),
    asyncMiddleware(getAllMyBill),
  );

router
  .route('/payment-events')
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.MGMT, typeRole.EMP]),
    asyncMiddleware(paymentEvents),
  );

router
  .route('/paypal')
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.EMP, typeRole.MGMT]),
    asyncMiddleware(createBillPaypal),
  );

router.route('/payment-status').post(asyncMiddleware(handleBillStatus));
router
  .route('/bill_branch')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getBillsByBranchId));

router
  .route('/:id')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.USER]),
    asyncMiddleware(getDetailBill),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deleteBill),
  );

module.exports = router;
