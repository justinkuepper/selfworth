var database = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  },
  useNullAsDefault: true
});

database.schema.hasTable('clients').then(exists => {
  if (!exists) {
    return database.schema.createTable('clients', t => {
      t.increments('id').primary();
      t.string('name', 100);
    });
  }
});

database.schema.hasTable('entries').then(exists => {
  if (!exists) {
    return database.schema.createTable('entries', t => {
      t.increments('id').primary();
      t.string('name', 100);
      t.integer('time');
      t.integer('client_id');
    });
  }
});

module.exports = database
