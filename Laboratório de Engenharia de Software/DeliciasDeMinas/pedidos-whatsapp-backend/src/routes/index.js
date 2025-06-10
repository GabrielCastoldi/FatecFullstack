const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");
const OrderController = require("../controllers/OrderController");

// Rotas de clientes
router.post("/clients", ClientController.create);
router.get("/clients", ClientController.index);

// Rotas de pedidos
router.post("/orders", OrderController.create);
router.get("/orders", OrderController.index);
router.patch("/orders/:id/payment", OrderController.updatePaymentStatus);

module.exports = router;
