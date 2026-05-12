'use strict';

require('reflect-metadata');
const { DataSource } = require('typeorm');
const Account = require('./entities/Account');
const JournalEntry = require('./entities/JournalEntry');

function open(filename = ':memory:') {
  return new DataSource({
    type: 'sqlite',
    database: filename,
    entities: [Account, JournalEntry],
    synchronize: false,
    logging: false,
  });
}

async function init(db) {
  await db.initialize();
  await db.synchronize();
}

module.exports = { open, init };
