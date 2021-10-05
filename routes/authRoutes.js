import express from 'express';
import {
  login,
  register,
  logout,
  currentUser,
  updateProfile,
  removeAsAdmin,
  getAdminUsers,
  getMembersUsers,
  makeUserAdmin,
  getUserProfile,
  updateUserPassword,
} from '../controllers/authController';
import {
  adminMiddleware,
  isAuth,
} from '../middlewares';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/current-user').get(isAuth, currentUser);
router.route('/userpublicprofile/:username').get(getUserProfile);
// router.route('/profile/:username').get(isAuth, getUserProfile);
router.route('/profile/:username').put(isAuth, updateProfile);
router
  .route('/profile/password/:username')
  .put(isAuth, updateUserPassword);

router
  .route('/make-user-admin/:username')
  .put(isAuth, makeUserAdmin);
router
  .route('/remove-user-admin/:username')
  .put(isAuth, removeAsAdmin);

router
  .route('/getadminusers')
  .get(isAuth, getAdminUsers);
router
  .route('/getmembersusers')
  .get(isAuth, getMembersUsers);

module.exports = router;
