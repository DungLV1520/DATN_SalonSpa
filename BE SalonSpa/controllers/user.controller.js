const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const userModel = require('../models/user.model');
const Otp = require('../models/activation.model');
const typeRole = require('../constants/typeRole');
const configuration = require('../configs/configuration');
const ErrorResponse = require('../helpers/ErrorResponse');
const mail = require('../services/sendMail.service');
const Employee = require('../models/employee.model');
const Mgmt = require('../models/mgmt.model');
const { generateToken, verifyToken } = require('../helpers/generateToken');
const { generateUniqueCode } = require('../helpers/genarateCode');
const statusUser = require('../constants/statusUser');

const { genarateRamdomPassword } = require('../helpers/genarateCode');
const admin = require('firebase-admin');
const serviceAccount = require('../configs/firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://salonspa-21-default-rtdb.firebaseio.com',
});

const getAllAccount = async (req, res, next) => {
  const {
    size = 7,
    page = 1,
    search: key,
    start: startDate,
    end: endDate,
  } = req.query;

  try {
    const bdQuery = {
      role: typeRole.USER,
      ...(key &&
        key != '""' && {
          email: {
            $regex: new RegExp('.*' + key + '.*', 'i'),
          },
        }),
      ...(startDate &&
        endDate && {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        }),
      ...(startDate &&
        !endDate && {
          createdAt: {
            $gte: new Date(startDate),
          },
        }),
      ...(!startDate &&
        endDate && {
          createdAt: {
            $lte: new Date(endDate),
          },
        }),
    };

    const accounts = await userModel
      .find(bdQuery)
      .sort('-createdAt')
      .skip(size * page - size)
      .limit(size)
      .exec();

    const count = await userModel.countDocuments(bdQuery);

    const bd = {
      current_page: page,
      total_page: Math.ceil(count / size),
      count,
      users: accounts,
    };

    return res.status(200).json(bd);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const register = async (req, res, next) => {
  let { ...body } = req.body;

  try {
    const emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
      if (emailExist.status === statusUser.Activated) {
        throw new Error(
          'This email already exists, please register with a different email address.',
        );
      }

      if (emailExist.status === statusUser.PendingVerify) {
        throw new Error(
          'This email already exists, waiting for active code by email.',
        );
      }
    }

    delete body.status;
    let user = await userModel.create(body);
    let payload = {
      email: user.email,
    };
    let code = await generateUniqueCode();

    await Otp.create({
      user: user._id,
      code,
    });

    //send verification code
    await mail.sendEmail(user.email, 'verification-code', code);

    return res.status(201).json({
      message: 'Verification code sent successfully.',
      data: payload,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const resendVerifyCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    let code = await generateUniqueCode();

    let user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('This email does not exist. Please create another one.');
    }
    //Deactivated older verification code
    await Otp.findOneAndUpdate(
      { user: user._id, active: true },
      { active: false },
    );
    //Create new verification code
    await Otp.create({
      user: user._id,
      code,
    });
    //send verification code
    await mail.sendEmail(email, 'verification-code', code);

    return res.status(200).json({
      message: 'Resend Verification Code Successfully.',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const verifyCode = async (req, res, next) => {
  const { code, email } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      throw new Error(
        'This email is not exists, please check your email again.',
      );
    }

    let validCode = await Otp.findOneAndUpdate(
      { user: user?._id, active: true },
      { active: false },
    );

    if (!validCode) {
      throw new Error('Verification code does not exist.');
    }

    let isValidCode = bcryptjs.compareSync(code, validCode?.code ?? '');

    if (!isValidCode) {
      throw new Error('Invalid verification code.');
    }
    //Change status to active user
    await userModel.findByIdAndUpdate(user?._id, {
      status: statusUser.Activated,
    });

    //send verification code
    await mail.sendEmail(email, 'signup', user.fullname);

    const payload = {
      email,
      _id: user?._id,
      role: user.role,
    };

    let token = jwt.sign(payload, configuration.SECRET_KEY, {
      expiresIn: '10h',
    });

    res.status(200).json({ ...payload, token });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error('You must enter an email address.');
    }

    const existingUser = await userModel.findOne({
      email,
      status: statusUser.Activated,
    });

    if (!existingUser) {
      throw new ErrorResponse(404, 'No user found for this email address.');
    }

    const payload = {
      user: existingUser.id,
      email: existingUser.email,
    };

    let token = generateToken(payload, 'forgot');
    await mail.sendEmail(existingUser.email, 'reset', token, req.headers.host);

    res.status(200).json({
      success: true,
      message: 'Please check your email for the link to reset your password.',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const payload = verifyToken(token, 'forgot');

    if (!payload) {
      throw new Error('Invalid token.');
    }

    const user = await userModel.findOne({
      _id: payload.user,
      email: payload.email,
      status: statusUser.Activated,
    });

    if (!user) {
      throw new ErrorResponse(
        403,
        'You are not allowed to reset your account. Please verify your email.',
      );
    }

    //update password
    await user.update({ password });

    await mail.sendEmail(payload.email, 'reset-confirmation');

    res.status(200).json({
      message: 'Your password has been reset',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const login = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    let user = await userModel.findOne({
      email,
    });

    if (!user) {
      throw new Error('Email or password is not correct. Please try again.');
    } else if (user.status !== statusUser.Activated) {
      throw new Error('Your account is not already activated.');
    }

    const checkPass = bcryptjs.compareSync(password, user.password);

    if (!checkPass) {
      throw new Error('Email or password is not correct. Please try again.');
    }

    let payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    let token = jwt.sign(payload, configuration.SECRET_KEY, {
      expiresIn: '10h',
    });

    return res.status(200).json({
      ...payload,
      jwt: token,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateAccount = async (req, res) => {
  let id = req.params.id;
  const { ...body } = req.body;
  try {
    if (req.user.role === typeRole.USER) {
      id = req.user._id;
      delete body.status;
      delete body.password;
    }

    const updatedAcc = await userModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json(updatedAcc);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updatePass = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password don't match" });
    }

    const user = await userModel.findById(userId);

    const isCurrentPasswordMatch = bcryptjs.compareSync(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    let payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    let token = jwt.sign(payload, configuration.SECRET_KEY, {
      expiresIn: '10h',
    });

    await user.update({ password: newPassword });

    return res.status(200).json({
      message: 'Password updated successfully',
      ...payload,
      jwt: token,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const deleteAcc = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAccount = await userModel.findByIdAndUpdate(
      id,
      { status: statusUser.Deactivated },
      { new: true },
    );

    res.status(200).json(updatedAccount);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('Account not found');
    }

    return res.status(200).json(user);
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getProfile = async (req, res, next) => {
  const { _id, email, role } = req.user;
  let staff;
  try {
    const user = await userModel
      .findOne({
        email,
        status: statusUser.Activated,
      })
      .select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    if (role == typeRole.EMP) {
      staff = await Employee.findOne({
        user: user._id,
      })
        .populate('branch')
        .populate('user');
    } else if (role == typeRole.MGMT) {
      staff = await Mgmt.findOne({
        user: user._id,
      })
        .populate('branch')
        .populate('user');
    } else {
      staff = user;
    }

    res.status(200).json({
      staff,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email, phone, fullname, gender } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (email && email !== user.email) {
      const isEmailUnique = await userModel.findOne({ email });

      if (isEmailUnique) {
        return res.status(400).json({ message: 'The email is already in use' });
      }

      let code = await generateUniqueCode();

      await Otp.create({
        user: user._id,
        code,
      });

      await mail.sendEmail(email, 'verification-update-profile', {
        code,
        fullname: user.fullname,
      });

      return res.status(200).json({
        code: 'NEW_EMAIL',
        message: 'Please verify your new email address.',
      });
    }

    if (phone && phone !== user.phone) {
      const isPhoneUnique = await userModel.findOne({ phone });
      if (isPhoneUnique) {
        return res.status(400).json({
          code: 400,
          message: 'The phone number has already been used.',
        });
      }
    }

    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (fullname) user.fullname = fullname;
    if (gender) user.gender = gender;

    const updateParams = {
      email: user.email,
      phone: user.phone,
      fullname: user.fullname,
      gender: user.gender,
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateParams,
      {
        new: true,
      },
    );

    res.status(200).json({
      code: 200,
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const verifyOtpUpdateProfile = async (req, res, next) => {
  try {
    const { code, newEmail } = req.body;
    const userId = req.user._id;

    let validCode = await Otp.findOneAndUpdate(
      { user: userId, active: true },
      { active: false },
    );

    if (!validCode) {
      throw new Error('The code does not exist.');
    }

    let isValidCode = bcryptjs.compareSync(code, validCode?.code ?? '');

    if (!isValidCode) {
      throw new Error('Invalid verification code.');
    }

    await userModel.findByIdAndUpdate(
      userId,
      { email: newEmail },
      {
        new: true,
      },
    );

    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const resendVerifyOtpUpdateProfile = async (req, res, next) => {
  const { newEmail } = req.body;
  const userId = req.user._id;
  try {
    let code = await generateUniqueCode();
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error('This email does not exist. Please create another one.');
    }

    await Otp.findOneAndUpdate(
      { user: user._id, active: true },
      { active: false },
    );

    await Otp.create({
      user: user._id,
      code,
    });

    await mail.sendEmail(newEmail, 'verification-update-profile', {
      code,
      fullname: user.fullname,
    });

    return res.status(200).json({
      message: 'Resend Verification Code Successfully.',
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const handleTokenAuthFirebase = async (req, res, next) => {
  try {
    const idToken = req.body.idToken;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    let user = await userModel.findOne({
      email: userRecord.email || userRecord.providerData[0].email,
    });

    if (user && user.status === statusUser.Deactivated) {
      throw new Error('Account is deactivated');
    }

    if (!user) {
      const password = genarateRamdomPassword();

      const body = {
        uid: userRecord.providerData[0].uid,
        email: userRecord.providerData[0].email,
        password: password,
        fullname: userRecord.providerData[0].displayName,
        providerId: userRecord.providerData[0].providerId,
        status: statusUser.Activated,
      };

      user = await userModel.create(body);
    }

    let payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    let token = jwt.sign(payload, configuration.SECRET_KEY, {
      expiresIn: '10h',
    });

    return res.status(200).json({
      ...payload,
      jwt: token,
    });
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

module.exports = {
  getAllAccount,
  register,
  resendVerifyCode,
  verifyCode,
  forgotPassword,
  resetPassword,
  login,
  updateAccount,
  updatePass,
  deleteAcc,
  findById,
  getProfile,
  updateProfile,
  verifyOtpUpdateProfile,
  resendVerifyOtpUpdateProfile,
  handleTokenAuthFirebase,
};
