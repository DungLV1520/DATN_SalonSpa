const billModel = require('../models/bill.model');
const serviceModel = require('../models/service.model');
const paypal = require('../configs/paypal');
const typeRole = require('../constants/typeRole');
const ErrorResponse = require('../helpers/ErrorResponse');
const Booking = require('../models/booking.model');
const mail = require('../services/sendMail.service');
const typeBill = require('../constants/typeBill');
const employeeModel = require('../models/employee.model');
const Mgmt = require('../models/mgmt.model');

const getAllBill = async (req, res) => {
  try {
    const { size = 7, page = 1, start: startDate, end: endDate } = req.query;
    const bdQuery = {};

    if (startDate && endDate) {
      bdQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      bdQuery.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      bdQuery.createdAt = { $lte: new Date(endDate) };
    }

    const bills = await billModel
      .find(bdQuery)
      .sort('-createdAt')
      .skip((page - 1) * size)
      .limit(Number(size))
      .populate({
        path: 'idEmpBill',
        model: 'employees',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate({
        path: 'idUser',
        model: 'users',
        select: 'fullname email',
      })
      .populate({
        path: 'idMgmt',
        model: 'managements',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate('services')
      .exec();

    const count = await billModel.countDocuments(bdQuery);
    const totalPages = Math.ceil(count / size);
    const response = {
      current_page: page,
      total_page: totalPages,
      count,
      users: bills,
    };

    return res.status(200).json(response);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getAllMyBill = async (req, res) => {
  try {
    let perPage = req.query.size || 7;
    let page = req.query.page || 1;
    let idKey = req.user.role === typeRole.USER ? 'idUser' : 'idEmp';

    const bill = await billModel
      .find({
        [idKey]: req.user._id,
      })
      .sort('-createdAt')
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'idEmpBill',
        model: 'employees',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate({
        path: 'idUser',
        model: 'users',
        select: 'fullname email',
      })
      .populate({
        path: 'idMgmt',
        model: 'managements',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate('services')
      .exec();

    let count = await billModel.countDocuments({
      [idKey]: req.user._id,
    });

    let bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count: count,
      users: bill,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getBillsByBranchId = async (req, res) => {
  const { id } = req.user;
  let perPage = req.query.size || 7;
  let page = req.query.page || 1;
  try {
    const mgmt = await Mgmt.findOne({ user: id });
    const employees = await employeeModel.find({ branch: mgmt.branch });

    let empIds = employees.map((em) => em._id);
    empIds = [...empIds, mgmt._id];

    const bills = await billModel
      .find({ idEmpBill: { $in: empIds } })
      .sort('-createdAt')
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'idEmpBill',
        model: 'employees',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate({
        path: 'idUser',
        model: 'users',
        select: 'fullname email',
      })
      .populate({
        path: 'idMgmt',
        model: 'managements',
        select: 'user branch',
        populate: [
          {
            path: 'branch',
            model: 'branches',
            select: 'name',
          },
          {
            path: 'user',
            model: 'users',
            select: 'fullname',
          },
        ],
      })
      .populate('services')
      .exec();

    let count = await billModel.countDocuments();

    let bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count: count,
      users: bills,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getDetailBill = async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await billModel.findById(id).populate('services');

    return res.status(200).json(bill);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createBill = async (req, res) => {
  try {
    const { ...body } = req.body;
    body.idEmp = req.user._id;
    const newBill = await billModel.create({
      ...body,
      status: typeBill.PAID,
    });

    return res.status(201).json({
      statusCode: 201,
      message: 'Bill created successfully',
      bill: newBill,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteBill = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await billModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: `Bill with id ${id} not found`,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Bill deleted successfully',
      deletedBill: result,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createBillPaypal = async (req, res) => {
  try {
    const newBill = await billModel.create({
      ...req.body,
      idEmp: req.user._id,
      status: typeBill.PENDING,
    });

    const idUser = req.user._id;

    let idBranch;

    if (req.user.role === typeRole.EMP) {
      const employee = await employeeModel.findOne({ user: idUser });
      idBranch = employee.branch;
    }

    if (req.user.role === typeRole.MGMT) {
      const mgmt = await Mgmt.findOne({ user: idUser });
      idBranch = mgmt.branch;
    }

    const services = await serviceModel.find({
      _id: { $in: req.body.services },
    });

    let obj = services.map((v) => {
      return {
        name: v.name,
        quantity: 1,
        price: +v.amount - +v.amount * (req.body.discount / 100),
        currency: 'USD',
      };
    });

    let total = obj.reduce((pre, curr) => {
      return pre + curr.price;
    }, 0);

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `http://localhost:4200/landing/success-payment?total=${total}&id_bill=${newBill._id}&idBranch=${idBranch}&idUser=${req.body.idUser}`,
        cancel_url: `http://localhost:4200/landing/cancel-payment&id_bill=${newBill._id}`,
      },
      transactions: [
        {
          item_list: {
            items: obj,
          },
          amount: {
            currency: 'USD',
            total: total.toString(),
          },
          description: 'Hat for the best team ever',
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        await billModel.findByIdAndUpdate(newBill._id, {
          status: typeBill.FAILED,
        });
        throw new ErrorResponse(500, error.message);
      } else {
        const approvalUrl = payment.links[1].href;
        const qrCodeUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          approvalUrl,
        )}&size=285x285`;

        res.status(201).json({ paymentUrl: approvalUrl, qrCodeUrl });
      }
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const handleBillStatus = async (req, res) => {
  const idBill = req.query.id_bill;
  const status = req.query.status;
  try {
    let checkBill = await billModel.findById(idBill).populate('idUser');
    if (!checkBill) {
      return res
        .status(500)
        .json({ statusCode: 500, message: 'This bill does not exist.' });
    }

    let message = '';
    let mailType = '';
    let responseCode = 201;
    let updateStatus = '';
    let mailData = {
      orderId: checkBill.paymentId,
      total:
        checkBill.totalMoney -
        checkBill.totalMoney * (checkBill.discount / 100),
      customerName: checkBill?.idUser?.fullname,
    };

    switch (status) {
      case 'success':
        if (checkBill.status === typeBill.PAID) {
          message = 'This bill has already been paid.';
          responseCode = 500;
          break;
        }
        updateStatus = typeBill.PAID;
        message = 'Payment success';
        mailType = 'send-payment-success-email';
        break;
      case 'failed':
        if (checkBill.status === typeBill.PAID) {
          message = 'This bill has already been paid.';
          responseCode = 500;
          break;
        }

        if (checkBill.status === typeBill.FAILED) {
          message = 'This bill had status failed.';
          responseCode = 500;
          break;
        }
        updateStatus = typeBill.FAILED;
        message = 'Success update When Payment error';
        mailType = 'send-payment-failed-email';
        break;
      default:
        message = 'Invalid status';
        responseCode = 500;
        break;
    }

    if (updateStatus) {
      await billModel
        .findByIdAndUpdate(idBill, { status: updateStatus })
        .populate('services');
      if (checkBill.idUser) {
        await mail.sendEmail(checkBill.idUser.email, mailType, mailData);
      }
    }

    return res
      .status(responseCode)
      .json({ statusCode: responseCode, message: message });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const paymentEvents = async (req, res) => {
  const { bookingId, event } = req.query;
  try {
    const booking = await Booking.findByIdAndUpdate(bookingId, {
      status: event,
    });

    if (!booking) {
      return res.status(404).json({
        message: `Booking not found with id ${bookingId}.`,
      });
    }

    res.status(202).json({
      message: `This booking has been ${event}.`,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllBill,
  getAllMyBill,
  getBillsByBranchId,
  getDetailBill,
  createBill,
  deleteBill,
  createBillPaypal,
  handleBillStatus,
  paymentEvents,
};
