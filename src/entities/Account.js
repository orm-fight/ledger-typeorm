'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Account',
  tableName: 'accounts',
  columns: {
    name: { type: 'text', primary: true },
    type: { type: 'text', nullable: false },
  },
});
