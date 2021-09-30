import Tag from '../models/tagsModel';
import slugify from 'slugify';
import Blog from '../models/blogModel';

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    const alreadyExist = await Tag.findOne({ slug }).exec();
    if (alreadyExist) return res.status(400).send('Tag name exist');
    const tag = await new Tag({ name, slug }).save();
    res.json(tag);
  } catch (error) {
    console.log(err);
    res.status(400).send('Tag create failed. Try again.');
  }
};

export const getTags = async (req, res) => {
  try {
    const tag = await Tag.find({}).exec();
    return res.json({ total: tag.length, tag });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Failed to get Tag');
  }
};

export const getSingleTag = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: 'Tag not found',
      });
    }
    // res.json(tag);
    Blog.find({ tags: tag })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .select(
        '_id title slug excerpt categories postedBy tags createdAt updatedAt',
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({ tag: tag, blogs: data });
      });
  });
};

export const deleteTag = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const tag = await Tag.findOneAndRemove({ slug }).exec();
    if (!tag) return res.status(400).send('Tag not found');
    res.json({ message: 'Tag Deleted Successfully' });
  } catch (err) {
    console.log(err);
  }
};
