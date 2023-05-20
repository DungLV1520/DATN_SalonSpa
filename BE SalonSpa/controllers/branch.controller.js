const ErrorResponse = require('../helpers/ErrorResponse');
const branchModel = require('../models/branch.model');

const getAllBranch = async (req, res, next) => {
  try {
    let perPage = req.query.size || 7;
    let page = req.query.page || 1;
    let search = req.query.search;
    let startDate = req.query.start || null;
    let endDate = req.query.end || null;
    let bdQuery = {};

    if (search && search !== '') {
      bdQuery.name = {
        $regex: new RegExp(search, 'i'),
      };
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

    const branches = await branchModel
      .find(bdQuery)
      .sort('-createdAt')
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    let count = await branchModel.countDocuments(bdQuery);
    let bd = {
      current_page: page,
      total_page: Math.ceil(count / perPage),
      count: count,
      users: branches,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const { ...body } = req.body;
    const newBranch = await branchModel.create(body);

    return res.status(201).json(newBranch);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    const { ...body } = req.body;
    const id = req.params.id;
    const branch = await branchModel.findById(id);

    if (!branch) {
      throw new ErrorResponse(404, 'Not found branch');
    }

    const updatedBranch = await branchModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(updatedBranch);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await branchModel.findByIdAndDelete(id);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const branch = await branchModel.findById(id);

    if (!branch) {
      throw new ErrorResponse(404, 'Not found branch');
    }

    return res.status(200).json(branch);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  findById,
};
