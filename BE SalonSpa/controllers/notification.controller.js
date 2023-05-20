const notiModel = require('../models/notification.model');
const typeRole = require('../constants/typeRole');
const userModel = require('../models/user.model');
const ErrorResponse = require('../helpers/ErrorResponse');
const Mgmt = require('../models/mgmt.model');
const employeeModel = require('../models/employee.model');

const getAllNotiOfUser = async (req, res) => {
  try {
    const idUser =
      req.user.role === typeRole.ADMIN ? req.params.id : req.user._id;
    const perPage = req.query.size || 7;
    const page = req.query.page || 1;
    const bdQuery = { idUser };

    const noties = await notiModel
      .find(bdQuery)
      .sort('-createdAt')
      .populate('idUser')
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await notiModel.countDocuments(bdQuery);
    const bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count: count,
      notifications: noties,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getAllNotiOfBranch = async (req, res) => {
  try {
    const idUser = req.user._id;
    const perPage = req.query.size || 7;
    const page = req.query.page || 1;
    let bdQuery = {};

    if (req.user.role === typeRole.EMP) {
      const employee = await employeeModel.findOne({ user: idUser });
      bdQuery.branch = employee.branch;
    }

    if (req.user.role === typeRole.MGMT) {
      const mgmt = await Mgmt.findOne({ user: idUser });
      bdQuery.branch = mgmt.branch;
    }

    const notifications = await notiModel
      .find(bdQuery)
      .sort('-createdAt')
      .populate('idUser')
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await notiModel.countDocuments(bdQuery);
    const totalPage = Math.ceil(count / perPage);

    const result = {
      current_page: page,
      total_page: totalPage,
      count: count,
      notifications: notifications,
    };

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getAllNotiByAdmin = async (req, res) => {
  try {
    const perPage = req.query.size || 7;
    const page = req.query.page || 1;

    const noties = await notiModel
      .find()
      .sort('-createdAt')
      .populate('idUser')
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await notiModel.countDocuments();
    const bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count: count,
      notifications: noties,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createNoti = async ({ idUser, content, image = '' }) => {
  try {
    const noti = await notiModel.create({ content, image, idUser });

    return res.status(201).json(noti);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createNotiFromAdmin = async (req, res) => {
  try {
    const { idUser, content, image = '' } = req.body;
    const user = await userModel.findById(idUser);
    if (!user) {
      throw new ErrorResponse(404, 'not found user');
    }
    const noti = await notiModel.create({ content, image, idUser });

    return res.status(201).json(noti);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createNotiForAllUserFromAdmin = async (req, res) => {
  try {
    const { content, image = '' } = req.body;
    const users = await userModel.find();
    const promises = users.map((user) =>
      notiModel.create({
        content,
        image,
        idUser: user._id,
      }),
    );

    await Promise.all([promises]);
    res.status(201).json({
      statusCode: 201,
      message: 'Create notification for all user success',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteNoti = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user._id;
    const bdQuery = {
      _id: id,
    };

    if (req.user.role !== typeRole.ADMIN) {
      bdQuery.idUser = idUser;
    }

    const result = await notiModel.findOneAndDelete(bdQuery);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllNotiOfUser,
  getAllNotiOfBranch,
  getAllNotiByAdmin,
  getAllNotiByAdmin,
  createNoti,
  createNotiFromAdmin,
  createNotiForAllUserFromAdmin,
  deleteNoti,
};
