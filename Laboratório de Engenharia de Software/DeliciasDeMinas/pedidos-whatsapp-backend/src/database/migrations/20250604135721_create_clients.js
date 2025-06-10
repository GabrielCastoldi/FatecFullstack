exports.up = function(knex) {
  return knex.schema.createTable('clients', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('phone').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('clients');
};