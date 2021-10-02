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
  authMiddleware,
  isAuth,
} from '../middlewares';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/current-user').get(isAuth, currentUser);
router.route('/userpublicprofile/:username').get(getUserProfile);
// router.route('/profile/:username').get(authMiddleware, getUserProfile);
router.route('/profile/:username').put(isAuth, updateProfile);
router
  .route('/profile/password/:username')
  .put(isAuth, updateUserPassword);

router
  .route('/make-user-admin/:username')
  .put(adminMiddleware, makeUserAdmin);
router
  .route('/remove-user-admin/:username')
  .put(isAuth, adminMiddleware, removeAsAdmin);

router
  .route('/getadminusers')
  .get(isAuth, adminMiddleware, getAdminUsers);
router
  .route('/getmembersusers')
  .get(isAuth, adminMiddleware, getMembersUsers);

module.exports = router;
