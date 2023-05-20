const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const {
  getAllEmployee,
  getAllEmployeeOfBranch,
  updateEmployee,
  deleteEmployee,
  findById,
  createEmpAccount,
} = require('../controllers/employee.controller');

router
  .route('/')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(getAllEmployee),
  )
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(createEmpAccount),
  );

router
  .route('/:id_em')
  .get(asyncMiddleware(findById))
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.EMP, typeRole.MGMT]),
    asyncMiddleware(updateEmployee),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN, typeRole.MGMT),
    asyncMiddleware(deleteEmployee),
  );

router
  .route('/branches/:id_branch')
  .get(
    asyncMiddleware(authMiddleware),
    roleMiddleware([typeRole.ADMIN, typeRole.MGMT]),
    asyncMiddleware(getAllEmployeeOfBranch),
  );

module.exports = router;
