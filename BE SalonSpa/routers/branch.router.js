const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const {
  getAllBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  findById,
} = require('../controllers/branch.controller');

router
  .route('/')
  .get(asyncMiddleware(getAllBranch))
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(createBranch),
  );

router
  .route('/:id')
  .get(asyncMiddleware(findById))
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(updateBranch),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deleteBranch),
  );

module.exports = router;
