const express = require("express");
const router = express.Router();
const { Posts, sequelize } = require("../models");
const PostsController = require("../controllers/Posts");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Likes } = require("../models");

router.get("/", validateToken, async (req, res) => {
  try {
    const response = await PostsController.get(req);
    return res.json(response);
  } catch (error) {
    console.error("Error in post route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
  const id = req.params.id;
  const response = await PostsController.getById(id);
  res.json(response);
  }catch (error) {
    console.error("Error in post route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  try {
    const response = await PostsController.save(post);
    res.json(response);
  } catch (error) {
    console.error("Error in post route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a route to execute raw SQL command
router.get("/customQuery", async (req, res) => {
  try {
    const customQuery = "SELECT * FROM posts"; // Replace with your actual SQL query
    const result = await sequelize.query(customQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

module.exports = router;
