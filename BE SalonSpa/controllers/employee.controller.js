const mongoose = require('mongoose');

const employeeModel = require('../models/employee.model');
const ErrorResponse = require('../helpers/ErrorResponse');
const userModel = require('../models/user.model');
const typeRole = require('../constants/typeRole');
const mail = require('../services/sendMail.service');
const Mgmt = require('../models/mgmt.model');
const { genarateRamdomPassword } = require('../helpers/genarateCode');
const statusUser = require('../constants/statusUser');

const getAllEmployee = async (req, res) => {
  try {
    const {
      size = 7,
      page = 1,
      search: key,
      start: startDate,
      end: endDate,
    } = req.query;
    const bdQuery = {};

    if (key && key != '""') {
      bdQuery.fullname = { $regex: new RegExp('.*' + key + '.*', 'i') };
    }

    if (startDate || endDate) {
      bdQuery.createdAt = {};
      if (startDate) bdQuery.createdAt.$gte = new Date(startDate);
      if (endDate) bdQuery.createdAt.$lte = new Date(endDate);
    }

    const [employees, count] = await Promise.all([
      employeeModel
        .find(bdQuery)
        .sort('-createdAt')
        .skip(size * page - size)
        .limit(size)
        .populate({
          path: 'branch',
          model: 'branches',
          select: 'name',
        })
        .populate({
          path: 'user',
          model: 'users',
        })
        .exec(),
      employeeModel.countDocuments(bdQuery),
    ]);

    const bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      users: employees,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getAllEmployeeOfBranch = async (req, res) => {
  try {
    let { id_branch: branch } = req.params;
    const perPage = req.query.size || 7;
    const page = req.query.page || 1;
    const key = req.query.search;

    if (req.user.role === typeRole.MGMT) {
      const { id } = req.user;
      const mgmt = await Mgmt.findOne({ user: id });
      branch = mgmt.branch;
    }

    const bdQuery = {
      branch,
      ...(key &&
        key != '""' && {
          fullname: { $regex: new RegExp('.*' + key + '.*', 'i') },
        }),
    };

    const employees = await employeeModel
      .find(bdQuery)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'branch',
        model: 'branches',
        select: 'name',
      })
      .populate({
        path: 'user',
        model: 'users',
      })
      .exec();
    const count = await employeeModel.countDocuments(bdQuery);
    const bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count,
      users: employees,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createEmpAccount = async (req, res, next) => {
  const { email, fullname, gender, phone, branch, age, job } = req.body;
  try {
    const existUser = await userModel
      .findOne({
        email: email,
        status: statusUser.Activated,
      })
      .select('-password');

    if (existUser) {
      throw new Error(`Email ${existUser.email} has already been used`);
    }

    const password = genarateRamdomPassword();
    const user = await userModel.create({
      email,
      fullname,
      gender,
      phone,
      password,
      role: typeRole.EMP,
      status: statusUser.Activated,
    });

    if (user) {
      await employeeModel.create({
        branch,
        age,
        job,
        user: user,
      });
    }

    //send email
    await mail.sendEmail(user.email, 'create-staff-account', {
      fullname: user.fullname,
      email: user.email,
      password,
    });

    res.status(201).json({
      message: `Create a employee successfully.`,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const idEm = req.params.id_em;
    const result = await employeeModel.findById(idEm);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const idEm = req.params.id_em;
    const { ...body } = req.body;
    const updatedEm = await employeeModel
      .findByIdAndUpdate(idEm, body, {
        new: true,
      })
      .session(session);

    if (!updatedEm) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    const user = await userModel
      .findOneAndUpdate({ _id: updatedEm.user }, body, { new: true })
      .session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(updatedEm);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteEmployee = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const idEm = req.params.id_em;
    const employee = await employeeModel.findById(idEm).session(session);

    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    const user = await userModel
      .findOneAndUpdate(
        { _id: employee.user },
        { status: statusUser.Deactivated },
        { new: true },
      )
      .session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Employee deactivated' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllEmployee,
  getAllEmployeeOfBranch,
  createEmpAccount,
  updateEmployee,
  findById,
  deleteEmployee,
};
