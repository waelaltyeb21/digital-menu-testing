const express = require("express");
const CategoryController = require("../Controllers/CategoryController");
const Categories = express.Router();

Categories.get("/:restaurant", CategoryController.GetCategories);
Categories.get("/:restaurant/:category", CategoryController.GetCategory);
Categories.post("/create_new_category", CategoryController.CreateNewCategory);
Categories.put("/update_category", CategoryController.UpdateCategory);
Categories.delete("/delete_category/:id", CategoryController.DeleteCategory);

module.exports = Categories;
