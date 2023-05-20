const mongoose = require('mongoose');

const typeRole = require('../constants/typeRole');
const ErrorResponse = require('../helpers/ErrorResponse');
const Mgmt = require('../models/mgmt.model');
const User = require('../models/user.model');
const mail = require('../services/sendMail.service');
const { genarateRamdomPassword } = require('../helpers/genarateCode');
const statusUser = require('../constants/statusUser');

const getAllManager = async (req, res) => {
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

    const [mgmt, count] = await Promise.all([
      Mgmt.find(bdQuery)
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
      Mgmt.countDocuments(bdQuery),
    ]);

    const bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      users: mgmt,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getAllManagerOfBranch = async (req, res) => {
  try {
    const { id_branch: branch } = req.params;
    const perPage = req.query.size || 7;
    const page = req.query.page || 1;
    const key = req.query.search;

    const bdQuery = {
      branch,
      ...(key &&
        key != '""' && {
          fullname: { $regex: new RegExp('.*' + key + '.*', 'i') },
        }),
    };

    const mgmt = await Mgmt.find(bdQuery)
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
    const count = await Mgmt.countDocuments(bdQuery);
    const bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count,
      users: mgmt,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateManager = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const idMgmt = req.params.id_mgmt;
    const { ...body } = req.body;
    const updatedMgmt = await Mgmt.findByIdAndUpdate(idMgmt, body, {
      new: true,
    }).session(session);

    if (!updatedMgmt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Mgmt not found' });
    }

    const user = await User.findOneAndUpdate({ _id: updatedMgmt.user }, body, {
      new: true,
    }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(updatedMgmt);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteMgmt = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const idMgmt = req.params.id_mgmt;
    const mgmt = await Mgmt.findById(idMgmt).session(session);

    if (!mgmt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Mgmt not found' });
    }

    const user = await User.findOneAndUpdate(
      { _id: mgmt.user },
      { status: statusUser.Deactivated },
      { new: true, session },
    ).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Mgmt deactivated' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const idMgmt = req.params.id_mgmt;
    const result = await Mgmt.findById(idMgmt);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createMgmtAccount = async (req, res, next) => {
  const { email, fullname, gender, phone, branch, avatar, age, yearExp } =
    req.body;
  try {
    const existUser = await User.findOne({
      email: email,
      status: statusUser.Activated,
    }).select('-password');

    if (existUser) {
      throw new Error(`Email ${existUser.email} has already been used`);
    }

    const password = genarateRamdomPassword();
    //save user model
    const user = await User.create({
      email,
      fullname,
      gender,
      phone,
      password,
      role: typeRole.MGMT,
      status: statusUser.Activated,
    });

    //Create mgmt account
    if (user) {
      await Mgmt.create({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        branch,
        avatar,
        age,
        yearExp,
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
      message: `Create a managerment successfully.`,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllManager,
  getAllManagerOfBranch,
  updateManager,
  deleteMgmt,
  findById,
  createMgmtAccount,
};
