const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const {
  getAllService,
  createService,
  updateService,
  deleteService,
  findById,
} = require('../controllers/service.controller');

router
  .route('/')
  .get(asyncMiddleware(getAllService))
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(createService),
  );

router
  .route('/:id_service')
  .get(asyncMiddleware(findById))
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(updateService),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(deleteService),
  );

module.exports = router;
