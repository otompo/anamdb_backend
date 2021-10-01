import express from 'express';
import {
  createTag,
  deleteTag,
  getSingleTag,
  getTags,
} from '../controllers/tagController';
import { runValidation } from '../validators';
import { tagCreateValidator } from '../validators/tagValidators';
import { requireSignin,isAuth, adminMiddleware } from '../middlewares';

const router = express.Router();

router
  .route('/tag')
  .post(
    requireSignin,
    isAuth,
    tagCreateValidator,
    runValidation,
    adminMiddleware,
    createTag,
  );
router.route('/tags').get(getTags);
router.route('/tag/:slug').get(getSingleTag);
router
  .route('/tag/:slug')
  .delete(requireSignin, isAuth, adminMiddleware, deleteTag);

module.exports = router;
