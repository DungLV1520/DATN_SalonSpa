const errorHandle = require('../middlewares/error.handle');
const ErrorResponse = require('../helpers/ErrorResponse');
const userRouter = require('./user.router');
const mgmtRouter = require('./mgmt.router');
const branchRouter = require('./branch.router');
const employeeRouter = require('./employee.router');
const serviceRouter = require('./service.router');
const postRouter = require('./post.router');
const bookingRouter = require('./booking.router');
const notiRouter = require('./notification.router');
const billRouter = require('./bill.router');

module.exports = (app) => {
  app.use('/api/users', userRouter);
  app.use('/api/mgmts', mgmtRouter);
  app.use('/api/branches', branchRouter);
  app.use('/api/employees', employeeRouter);
  app.use('/api/services', serviceRouter);
  app.use('/api/posts', postRouter);
  app.use('/api/booking', bookingRouter);
  app.use('/api/notification', notiRouter);
  app.use('/api/bill', billRouter);

  app.use('*', (req, res, next) => {
    throw new ErrorResponse(404, 'Page not found');
  });
  app.use(errorHandle);
};
