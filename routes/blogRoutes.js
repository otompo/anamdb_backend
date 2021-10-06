import express from 'express';
import { adminMiddleware, isAdmin, isAuth } from './../middlewares/index';
import {
  createBlog,
  listBlogsByUser,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getImage,
  listPublishBlogs,
  listUnpublishBlogs,
  listAllBlogsCategories,
  publishBlog,
  unpublishBlog,
  getSingleUnplishBlog,
} from './../controllers/blogController';

const router = express.Router();

router.route('/blog').post(isAuth, createBlog);

router.route('/blogs/list-blogs-categories').post(listAllBlogsCategories);
router.route('/blog/:slug').get(getSingleBlog);
router.route('/blog/unpublish/:slug').get(isAuth, getSingleUnplishBlog);
router.route('/blog/:slug').delete(isAuth, deleteBlog);
router.route('/blog/:slug').put(isAuth, updateBlog);
router.route('/blog/img/:slug').get(getImage);
router.route('/blogs/listpublished').get(isAuth,  listPublishBlogs);
router.route('/blogs/listunpublished').get(isAuth, listUnpublishBlogs);
// router.route('/blog/related').post(listRelated);
// router.route('/blogs/search').get(listSearch);

// this Auth user blog crud
// router.route('/user/blog').post( authMiddleware, createBlog);
router.route('/:userId/blogs').get(listBlogsByUser);

// router
//   .route('/user/blog/:slug')
//   .delete( authMiddleware, canUpdateDeleteBlog, removeBlog);

// router
//   .route('/user/blog/:slug')
//   .put( authMiddleware, canUpdateDeleteBlog, updateBlog);

router.route('/blog/publish/:slug').put(isAuth, publishBlog);

router.route('/blog/unpublish/:slug').put(isAuth, unpublishBlog);

module.exports = router;
