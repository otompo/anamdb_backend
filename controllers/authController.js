import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/authHelpers';
import shortId from 'shortid';
import { generateToken } from '../middlewares';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // username
    let username = shortId.generate();
    // validation
    if (!name) {
      return res.status(404).send('name is required');
    }
    if (!password || password.length < 6) {
      return res
        .status(404)
        .send('password is required and should be min 6 characters long');
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send('Email is taken ');
    // hash password
    const hashedPassword = await hashPassword(password);

    // register user
    const user = new User({
      email,
      name,
      username,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ mesage: 'User Save Succeffuly', user });
  } catch (err) {
    console.log(err);
    res.status('404').send('Error. Try again ');
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send('No user found');
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send('Wrong password');
    // create signed jwt

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
      email: user.email,
        username:user.username
      },
      process.env.JWT_SECRET || 'somethingsecretoneandgreate',
      {
        expiresIn: '3d',
      },
    );
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie
 // send token in cookie
    res.cookie('token', token, {
      httpOnly: true
      // secure: true, // only works on https
    });
    const { ...others } = user._doc;
    // send user as json response
    res.status(200).json({ ...others, token });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();

    // console.log("CURRENT_USER", user);
    return res.json(user);
    // return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Please login is required');
  }
};

export const makeUserAdmin = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { role: 'Admin' },
      },
      { new: true },
    ).exec();
     res.send({ ok: true });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeAsAdmin = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $pull: { role: 'Admin' },
      },
      { new: true },
    ).exec();
    res.send({ ok: true });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'Admin' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send('Users not found');
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getMembersUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'Member' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send('Users not found');
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select('-password -role -username')
      .exec();
    if (!user) return res.status(400).send('User not found');
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { name, email, username } = req.body;

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send('Email is taken ');

    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(400).send('User not found');
    // hash password

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
    }

    // console.log(user);
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(404)
        .send('password is required and should be min 6 characters long');
    }

    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(400).send('User not found');
    // hash password

    let hashedPassword = await hashPassword(newPassword);
    const userupdated = await User.findOneAndUpdate(
      {
        user,
      },
      {
        password: hashedPassword,
      },
    ).exec();
    // if (!userupdated) return res.status(400).send('Can not update user');
    res.send({ Ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

/**
export const userPhoto = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    if (user.photo.data) {
      res.set('Content-Type', user.photo.contentType);
      return res.send(user.photo.data);
    }
  });
}; 
  */

export const userstats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
