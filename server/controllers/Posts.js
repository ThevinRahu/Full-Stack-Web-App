const { Posts } = require("../models");
const { Likes } = require("../models");

async function save(post) {
  try {
    const res = await Posts.create(post);
    return res;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}

async function get(req) {
  try {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    return ({ listOfPosts: listOfPosts, likedPosts: likedPosts });
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}

async function getById(id) {
  try {
    const listOfPosts = await Posts.findByPk(id);
    return listOfPosts;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}

module.exports = {
  save,get,getById
};
