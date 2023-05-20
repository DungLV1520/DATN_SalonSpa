const { calculateTotalAmount } = require('../helpers/calculateTotalAmount');
const ErrorResponse = require('../helpers/ErrorResponse');
const bookingModel = require('../models/booking.model');
const employeeModel = require('../models/employee.model');
const mail = require('../services/sendMail.service');
const typeRole = require('../constants/typeRole');
const Mgmt = require('../models/mgmt.model');

const getAllBook = async (req, res) => {
  try {
    let { size = 7, page = 1, search, status, startDate, endDate } = req.query;

    const bdQuery = {};
    const bdStatus = {};

    if (search && search !== '""') {
      bdQuery.name = {
        $regex: new RegExp('.*' + search + '.*', 'i'),
      };
    }

    if (status) {
      bdQuery.status = status;
    }

    if (startDate && endDate) {
      bdQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      bdQuery.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      bdQuery.createdAt = {
        $lte: new Date(endDate),
      };
    }

    if (req.user.role === typeRole.EMP) {
      const employees = await employeeModel.findOne({ user: req.user._id });

      bdQuery.branch = employees.branch;
      bdStatus.branch = employees.branch;
    }

    if (req.user.role === typeRole.MGMT) {
      const mgmt = await Mgmt.findOne({ user: req.user._id });

      bdQuery.branch = mgmt.branch;
      bdStatus.branch = mgmt.branch;
    }

    const bookings = await bookingModel
      .find(bdQuery)
      .skip(size * page - size)
      .sort('-createdAt')
      .limit(size)
      .populate({
        path: 'services',
      })
      .populate({
        path: 'branch',
        select: 'name',
      })
      .exec();

    let count = await bookingModel.countDocuments(bdQuery);
    const totalStatus = await bookingModel.aggregate([
      {
        $match: bdStatus,
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          statuses: { $push: { status: '$_id', count: '$count' } },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const statusCounts = totalStatus[0]?.statuses.reduce((obj, status) => {
      obj[status.status] = status.count;
      return obj;
    }, {});

    let bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count: count,
      totalAllStatus: totalStatus[0]?.total,
      totalStatus: statusCounts,
      users: bookings,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getBookingByUser = async (req, res) => {
  try {
    let { size = 7, page = 1 } = req.query;
    const idUser = req.user._id;

    const bookings = await bookingModel
      .find({ user: idUser })
      .sort('-time')
      .populate('services')
      .populate('branch')
      .skip(size * page - size)
      .limit(size)
      .exec();

    const count = await bookingModel.countDocuments({ user: idUser });

    const bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      bookings: bookings,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createNewBooking = async (req, res) => {
  const idUser = req.user._id;
  const { branch, name, phone, services, quantity, time } = req.body;
  try {
    let totalAmount = await calculateTotalAmount(services, quantity);
    const newBook = await bookingModel.create({
      name,
      phone,
      services,
      branch,
      amount: totalAmount,
      time,
      user: idUser,
    });

    //send mail confirm booking
    await mail.sendEmail(req.user.email, 'booking-confirmation', newBook);

    return res.status(201).json(newBook);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateBookingUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user._id;
    const { ...body } = req.body;
    const updatedBook = await bookingModel.findOneAndUpdate(
      { _id: id, idUser: idUser },
      body,
      {
        new: true,
      },
    );

    return res.status(200).json(updatedBook);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateBookingAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const body = {
      isCome: 1,
    };

    const updatedBook = await bookingModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(updatedBook);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingModel.findByIdAndDelete(id);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const cancelBookingByUser = async (req, res) => {
  const id = req.params.id;
  const idUser = req.user._id;
  try {
    const booking = await bookingModel.findOne({ _id: id });
    if (booking.user.equals(idUser)) {
      const updatedBooking = await bookingModel.findByIdAndUpdate(id, {
        status: 'Cancelled',
      });

      if (!updatedBooking) {
        return res.status(404).json({
          message: `Booking not found with id ${id}.`,
        });
      }

      res.status(202).json({
        message: `This booking has been cancelled.`,
      });
    } else {
      return res.status(401).json({
        message: `You are not authorized to cancel this booking.`,
      });
    }
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllBook,
  getBookingByUser,
  createNewBooking,
  updateBookingUser,
  updateBookingAdmin,
  deleteBooking,
  cancelBookingByUser,
};
