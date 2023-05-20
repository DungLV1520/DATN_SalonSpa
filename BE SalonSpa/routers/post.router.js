const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../middlewares/async.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const typeRole = require('../constants/typeRole');

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  findById,
} = require('../controllers/post.controller');

router
  .route('/')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getAllPost))
  .post(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    upload.single('image'),
    asyncMiddleware(createPost),
  );

router
  .route('/:id')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(findById))
  .patch(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    upload.single('image'),
    asyncMiddleware(updatePost),
  )
  .delete(
    asyncMiddleware(authMiddleware),
    roleMiddleware(typeRole.ADMIN),
    asyncMiddleware(deletePost),
  );
module.exports = router;
