const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const {
  getAllNotiOfUser,
  deleteNoti,
  createNotiFromAdmin,
  createNotiForAllUserFromAdmin,
  getAllNotiByAdmin,
  getAllNotiOfBranch,
} = require('../controllers/notification.controller');
const roleMiddleware = require('../middlewares/role.middleware');
const typeRole = require('../constants/typeRole');

router
  .route('/')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getAllNotiOfUser))
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.EMP]),
    asyncMiddleware(createNotiFromAdmin),
  );

router
  .route('/all_manager')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN]),
    asyncMiddleware(getAllNotiByAdmin),
  );

router
  .route('/all_branch')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.EMP, typeRole.MGMT]),
    asyncMiddleware(getAllNotiOfBranch),
  );

router
  .route('/:id')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getAllNotiOfUser))
  .delete(asyncMiddleware(authMiddleware), asyncMiddleware(deleteNoti));

router
  .route('/all_users')
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(createNotiForAllUserFromAdmin),
  );

module.exports = router;
