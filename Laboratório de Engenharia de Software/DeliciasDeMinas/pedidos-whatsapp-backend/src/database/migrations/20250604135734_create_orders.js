exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.increments('id').primary();
    table.integer('client_id').unsigned().references('id').inTable('clients');
    table.string('product').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price').notNullable();
    table.string('payment_status').defaultTo('pendente');
    table.date('date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
