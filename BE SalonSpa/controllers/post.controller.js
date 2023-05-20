const postModel = require('../models/post.model');
const cloudinary = require('../configs/cloudinary');

const getAllPost = async (req, res) => {
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
      bdQuery.title = { $regex: new RegExp('.*' + key + '.*', 'i') };
    }

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

    const posts = await postModel
      .find(bdQuery)
      .sort('-createdAt')
      .skip(size * page - size)
      .limit(size)
      .exec();
    const count = await postModel.countDocuments(bdQuery);
    const bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      users: posts,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const createPost = async (req, res) => {
  try {
    const { ...body } = req.body;
    if (req?.file?.path) {
      const image = await cloudinary.uploader.upload(req.file.path);
      body.image = image.secure_url;
    }
    const newPost = await postModel.create(body);

    return res.status(201).json(newPost);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { ...body } = req.body;
    if (req?.file?.path) {
      const image = await cloudinary.uploader.upload(req.file.path);
      body.image = image.secure_url;
    }
    const updatedPost = await postModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await postModel.findByIdAndDelete(id);

    return res.status(200).json(result);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postModel.findById(id);

    return res.status(200).json(post);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  findById,
};
