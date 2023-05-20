const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const typeRole = require('../constants/typeRole');
const authMiddleware = require('../middlewares/auth.middleware');

const {
  createMgmtAccount,
  getAllManager,
  getAllManagerOfBranch,
  updateManager,
  deleteMgmt,
  findById,
} = require('../controllers/mgmt.controller');

router
  .route('/')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(getAllManager),
  )
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(createMgmtAccount),
  );

router
  .route('/:id_mgmt')
  .get(asyncMiddleware(findById))
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.MGMT]),
    asyncMiddleware(updateManager),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deleteMgmt),
  );

router
  .route('/branches/:id_branch')
  .get(asyncMiddleware(getAllManagerOfBranch));

module.exports = router;
