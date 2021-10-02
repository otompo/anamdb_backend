import express from 'express';
import {
  adminMiddleware,
  authMiddleware,
  isAuth,
} from './../middlewares/index';
import {
  createBlog,
  listBlogs,
  listBlogsByUser,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getImage,
  listPublishBlogs,
  listUnpublishBlogs,
  listAllBlogsCategoriesTags,
  publishBlog,
  unpublishBlog,
} from './../controllers/blogController';

const router = express.Router();

router.route('/blog').post(isAuth, createBlog);

router.route('/blogs').get(listBlogs);
router
  .route('/blogs/list-blogs-categories-tags')
  .post(listAllBlogsCategoriesTags);
router.route('/blog/:slug').get(getSingleBlog);
router
  .route('/blog/:slug')
  .delete(isAuth, adminMiddleware, deleteBlog);
router
  .route('/blog/:slug')
  .put(isAuth, adminMiddleware, updateBlog);
router.route('/blog/img/:slug').get(getImage);
router
  .route('/blogs/listpublished')
  .get(isAuth, adminMiddleware, listPublishBlogs);
router
  .route('/blogs/listunpublished')
  .get(isAuth, adminMiddleware, listUnpublishBlogs);
// router.route('/blog/related').post(listRelated);
// router.route('/blogs/search').get(listSearch);

// this Auth user blog crud
// router.route('/user/blog').post(authMiddleware, createBlog);
router.route('/:userId/blogs').get(listBlogsByUser);

// router
//   .route('/user/blog/:slug')
//   .delete( isAuth, authMiddleware, canUpdateDeleteBlog, removeBlog);

// router
//   .route('/user/blog/:slug')
//   .put( isAuth, authMiddleware, canUpdateDeleteBlog, updateBlog);

router
  .route('/blog/publish/:slug')
  .put(isAuth, adminMiddleware, publishBlog);

router
  .route('/blog/unpublish/:slug')
  .put(isAuth, adminMiddleware, unpublishBlog);

module.exports = router;
