const { default: mongoose, isValidObjectId } = require("mongoose");
const TableModel = require("../Models/TableModel");

const TableController = {
  // Get All Tables
  GetTables: async (req, res) => {
    try {
      const tables = await TableModel.find();
      return res.json(tables)
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong!" });
    }
  },
  // Get Table By ID
  GetTable: async (req, res) => {
    const { tableID } = req.params;
    try {
      // Check If TableID Is Valid
      if (isValidObjectId(tableID)) {
        // If It's => Find
        const table = await TableModel.findById(tableID);
        // If Found => 200 OK Response
        if (table)
          return res.status(200).json({ msg: "Table Found", table: table });
        // If Not Found => 400 Response
        return res.status(400).json({ msg: "Table Not Found" });
      } else {
        // If Not Valid TableID
        return res.status(400).json({ msg: "Not Valid Table ID" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong!" });
    }
  },
  // Create New Table
  CreateNewTable: async (req, res) => {
    const { tablesLength, restaurantID } = req.body;
    try {
      // Client Side
      let tables = [];
      for (let i = 1; i <= tablesLength; i++) {
        tables.push({ tableID: `T${i}`, restaurant: restaurantID });
      }
      console.log(tables);
      // Server Side
      const newTables = await TableModel.insertMany(tables);
      res.status(201).json({
        msg: `New ${tablesLength} Tables Has Been Created Successfuly!`,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong!" });
    }
  },
  // Update Table
  UpdateTable: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong!" });
    }
  },
  // Delete Table
  DeleteTable: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong!" });
    }
  },
};
module.exports = TableController;
