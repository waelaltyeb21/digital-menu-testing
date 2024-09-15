const express = require("express");
const TableController = require("../Controllers/TableController");
const Tables = express.Router();

Tables.get("/", TableController.GetTables);
Tables.get("/:tableID", TableController.GetTable);
Tables.post("/create_new_tables", TableController.CreateNewTable);
Tables.put("/update_table", TableController.UpdateTable);
Tables.delete("/delete_tables", TableController.DeleteTable);

module.exports = Tables;
