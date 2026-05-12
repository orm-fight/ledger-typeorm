'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'JournalEntry',
  tableName: 'journal_entries',
  columns: {
    id: { type: 'integer', primary: true, generated: true },
    description: { type: 'text', nullable: false },
    account_debit: { type: 'text', nullable: false },
    account_credit: { type: 'text', nullable: false },
    amount: { type: 'integer', nullable: false },
    date: { type: 'text', nullable: false },
  },
});
