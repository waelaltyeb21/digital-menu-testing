const { isValidObjectId, default: mongoose } = require("mongoose");
const OrderModel = require("../Models/OrderModel");
const io = require("../Public");

const OrderController = {
  // Get All Orders
  GetOrders: async (req, res) => {
    const { restaurant } = req.params;
    try {
      if (isValidObjectId(restaurant)) {
        const orders = await OrderModel.aggregate([
          {
            $match: {
              restaurant: new mongoose.Types.ObjectId(restaurant),
            },
          },
          {
            $unwind: "$orders",
          },
          {
            $lookup: {
              from: "tables",
              localField: "table",
              foreignField: "_id",
              as: "tables",
            },
          },
          {
            $unwind: "$tables",
          },
          {
            $lookup: {
              from: "dishes",
              localField: "orders.order",
              foreignField: "_id",
              as: "dishes",
            },
          },
          {
            $unwind: "$dishes",
          },
          {
            $group: {
              _id: "$table",
              table: {
                $push: {
                  id: "$table",
                  tableName: "$tables.tableID",
                  active: "$tables.active",
                },
              },
              totalOrders: { $sum: 1 },
              totalQuntity: { $sum: "$orders.quantity" },
              total: {
                $sum: { $multiply: ["$dishes.price", "$orders.quantity"] },
              },
              dishes: {
                $push: {
                  name: "$dishes.name",
                  quantity: "$orders.quantity",
                  price: "$dishes.price",
                },
              },
            },
          },
          // {
          //   $project: {
          //     _id: 1,
          //     totalOrders: 1,
          //     totalQuntity: 1,
          //     total: 1,
          //     dishes: 1,
          //   },
          // },
        ]);
        if (orders) return res.status(200).json(orders);
        return res.status(400).json({ msg: "Not Found" });
      }
      return res.status(400).json({ msg: "Invalid Restaurant" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Get Order
  GetOrder: async (req, res) => {
    const { id: orderID } = req.params;
    try {
      if (isValidObjectId(orderID)) {
        const [orders] = await OrderModel.aggregate([
          {
            $match: {
              table: new mongoose.Types.ObjectId(orderID),
            },
          },
          {
            $unwind: "$orders",
          },
          {
            $lookup: {
              from: "dishes",
              localField: "orders.order",
              foreignField: "_id",
              as: "dishes",
            },
          },
          {
            $unwind: "$dishes",
          },
          {
            $group: {
              _id: "$table",
              totalOrders: { $sum: 1 },
              totalQuntity: { $sum: "$orders.quantity" },
              total: {
                $sum: { $multiply: ["$dishes.price", "$orders.quantity"] },
              },
              orders: {
                $push: {
                  name: "$dishes.name",
                  price: "$dishes.price",
                  quantity: "$orders.quantity",
                },
              },
            },
          },
        ]);
        // -----------------------------------------------
        if (orders) return res.status(200).json(orders);
        // -----------------------------------------------
        return res.status(400).json({ msg: "No Order Found" });
      }
      // -----------------------------------------------
      return res.status(400).json({ msg: "Invalid Order" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Create New Order
  CreateNewOrder: async (req, res) => {
    const { orders, restaurant, table, total, dishes, user } = req.body;
    try {
      console.log(orders, restaurant, table, total, dishes, user);
      if (isValidObjectId(table) && isValidObjectId(restaurant)) {
        // Orders Data
        const data = {
          orders,
          dishes,
          restaurant,
          table,
          total,
          user,
        };
        // ---------------------------------------------------
        // Use Temp Collection To Store Data
        // ---------------------------------------------------
        console.log(data);
        // Request For New Order
        // ---------------------------------------------------
        if (data) {
          // -----------------------------------------------

          // -----------------------------------------------
          const order = {
            msg: "هنالك طلب جديد!",
            order: data,
          };
          io.emit("New-Order", order);
          // -----------------------------------------------
          return res.status(201).json({
            msg: "تم ارسال الطلب الرجاء الانتظار حتى يتم اشعارك بالموافقة",
            orders: {
              orders: orders,
              table: table._id,
              total: total,
            },
          });
        }
        // ---------------------------------------------------
        return res.status(400).json({
          msg: "Faild To Create New Order",
        });
        // ---------------------------------------------------
      }
      return res.status(400).json({ msg: "Invalid Data" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Accept Order From Admin
  AcceptOrder: async (req, res) => {
    const { orders, restaurant, table, total } = req.body;
    try {
      if (isValidObjectId(table)) {
        // Orders Data
        const data = {
          orders,
          restaurant,
          table,
          total,
        };
        console.log(data);
        // Create New Order
        const order = await OrderModel.create(data);
        // ---------------------------------------------------
        // Table Is Not Active
        // ---------------------------------------------------
        console.log(order);
        if (order) {
          const [orders] = await OrderModel.aggregate([
            {
              $match: {
                table: new mongoose.Types.ObjectId(order.table),
              },
            },
            {
              $unwind: "$orders",
            },
            {
              $lookup: {
                from: "dishes",
                localField: "orders.order",
                foreignField: "_id",
                as: "dishes",
              },
            },
            {
              $unwind: "$dishes",
            },
            {
              $group: {
                _id: "$table",
                table: {
                  $push: {
                    id: "$table",
                    tableName: "$tables.tableID",
                    active: "$tables.active",
                  },
                },
                totalOrders: { $sum: 1 },
                totalQuntity: { $sum: "$orders.quantity" },
                total: {
                  $sum: { $multiply: ["$dishes.price", "$orders.quantity"] },
                },
                orders: {
                  $push: {
                    name: "$dishes.name",
                    price: "$dishes.price",
                    quantity: "$orders.quantity",
                  },
                },
              },
            },
          ]);
          console.log(orders);
          // -----------------------------------------------
          // if (orders) return res.status(200).json(orders);
          if (orders) {
            io.emit("New-Order", {
              msg: "New Hungry Client Is Here!",
              order: orders,
            });
          }
          return res.status(201).json({
            msg: "Order Created Successfully",
            orders: {
              orders: orders,
              table: table._id,
              total: total,
            },
          });
        }
        // ---------------------------------------------------
        return res.status(400).json({
          msg: "Faild To Create New Order",
        });
        // ---------------------------------------------------
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Update Order
  UpdateOrder: async (req, res) => {
    try {
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Delete Order
  DeleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      if (isValidObjectId(id)) {
        const order = await OrderModel.findOneAndDelete({ table: id });
        if (order)
          return res.status(200).json({ msg: "Order Has Been Deleted" });
        return res.status(400).json({ msg: "Error: Not Deleted" });
      }
      return res.status(400).json({ msg: "Invalid Order" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
};
module.exports = OrderController;
