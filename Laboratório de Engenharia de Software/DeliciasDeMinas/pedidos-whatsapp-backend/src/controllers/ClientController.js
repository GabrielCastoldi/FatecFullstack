const knex = require("knex")(require("../database/knexfile").development);

module.exports = {
  async create(req, res) {
    const { name, phone } = req.body;

    try {
      const [id] = await knex("clients").insert({ name, phone });
      return res.status(201).json({ id, name, phone });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao criar cliente" });
    }
  },

  async index(req, res) {
    try {
      const clients = await knex("clients").select("*");
      return res.json(clients);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  }
};
