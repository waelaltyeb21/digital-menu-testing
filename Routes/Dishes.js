const express = require("express");
const DishController = require("../Controllers/DishController");
const DishModel = require("../Models/DishModel");
const Dishes = express.Router();

Dishes.get("/:restaurant", DishController.GetDishes);
Dishes.get("/:id", DishController.GetDish);
Dishes.get("/categories", DishController.GetDishesByCategory);
Dishes.post("/create_new_dish", DishController.CreateNewDish);
Dishes.put("/update_dish", DishController.UpdateDish);
Dishes.delete("/delete_dish/:id", DishController.DeleteDish);

module.exports = Dishes;
