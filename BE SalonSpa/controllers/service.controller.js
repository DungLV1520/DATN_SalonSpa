const serviceModel = require('../models/service.model');
const ErrorResponse = require('../helpers/ErrorResponse');

const getAllService = async (req, res) => {
  try {
    const {
      size = 7,
      page = 1,
      search: key,
      start: startDate,
      end: endDate,
    } = req.query;
    const bdQuery = {};

    if (key && key !== '""') {
      bdQuery.name = { $regex: new RegExp('.*' + key + '.*', 'i') };
    }

    if (startDate || endDate) {
      bdQuery.createdAt = {};
      if (startDate) bdQuery.createdAt.$gte = new Date(startDate);
      if (endDate) bdQuery.createdAt.$lte = new Date(endDate);
    }

    const [services, count] = await Promise.all([
      serviceModel
        .find(bdQuery)
        .sort('-createdAt')
        .skip(size * page - size)
        .limit(size)
        .exec(),
      serviceModel.countDocuments(bdQuery),
    ]);

    return res.status(200).json({
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      users: services,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createService = async (req, res) => {
  try {
    const { ...body } = req.body;
    const newService = await serviceModel.create(body);

    return res.status(201).json(newService);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateService = async (req, res) => {
  try {
    const { ...body } = req.body;
    const idService = req.params.id_service;
    const updatedService = await serviceModel.findByIdAndUpdate(
      idService,
      body,
      { new: true },
    );

    return res.status(200).json(updatedService);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteService = async (req, res) => {
  try {
    const idService = req.params.id_service;
    const result = await serviceModel.findByIdAndDelete(idService);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const idService = req.params.id_service;
    const result = await serviceModel.findById(idService);

    if (!result) {
      throw new ErrorResponse(404, 'not found service');
    }

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllService,
  createService,
  updateService,
  deleteService,
  findById,
};
