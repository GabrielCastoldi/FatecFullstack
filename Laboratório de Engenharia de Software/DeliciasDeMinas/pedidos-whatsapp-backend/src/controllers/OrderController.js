const knex = require("knex")(require("../database/knexfile").development);

module.exports = {
  async create(req, res) {
    const { client_id, product, quantity, price } = req.body;

    try {
      const [id] = await knex("orders").insert({
        client_id,
        product,
        quantity,
        price,
        payment_status: "pendente"
      });

      return res.status(201).json({ id });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao criar pedido" });
    }
  },

  async index(req, res) {
    try {
      const orders = await knex("orders")
        .join("clients", "orders.client_id", "clients.id")
        .select(
          "orders.id",
          "clients.name as client_name",
          "orders.product",
          "orders.quantity",
          "orders.price",
          "orders.payment_status",
          "orders.date"
        );
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  },

  async updatePaymentStatus(req, res) {
    const { id } = req.params;
    const { payment_status } = req.body;

    try {
      await knex("orders").where({ id }).update({ payment_status });
      return res.status(200).json({ message: "Status de pagamento atualizado" });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao atualizar pagamento" });
    }
  }
};
