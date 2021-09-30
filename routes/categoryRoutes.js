import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
} from '../controllers/categoryController';

import { runValidation } from '../validators';
import { categoryCreateValidator } from '../validators/categoryValidators';

import { requireSignin, adminMiddleware } from './../middlewares/index';

const router = express.Router();

router
  .route('/category')
  .post(
    categoryCreateValidator,
    runValidation,
    requireSignin,
    adminMiddleware,
    createCategory,
  );

router.route('/categories').get(requireSignin, adminMiddleware, getCategories);
router.route('/category/:slug').get(getSingleCategory);
router
  .route('/category/:slug')
  .delete(requireSignin, adminMiddleware, deleteCategory);

module.exports = router;
