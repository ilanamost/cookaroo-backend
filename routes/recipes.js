const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const recipeController = require("../controllers/recipes");

const router = express.Router();

router.post(
  "",
  checkAuth,
  extractFile,
  recipeController.createRecipe
);

router.put(
  "/:id",
  checkAuth,
  extractFile,
  recipeController.updateRecipe
);

router.get("", recipeController.getRecipes);

router.get("/:id", recipeController.getRecipe);

router.delete("/:id", checkAuth, recipeController.deleteRecipe);

module.exports = router;