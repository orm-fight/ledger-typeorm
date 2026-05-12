'use strict';

const { open, init } = require('../src/db');

async function createFixture() {
  const db = open(':memory:');
  await init(db);
  return {
    db,
    cleanup: () => db.destroy(),
  };
}

module.exports = { createFixture };
