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
  relations: {
    debit_account: {
      type: 'many-to-one',
      target: 'Account',
      joinColumn: { name: 'account_debit', referencedColumnName: 'name' },
      nullable: false,
    },
    credit_account: {
      type: 'many-to-one',
      target: 'Account',
      joinColumn: { name: 'account_credit', referencedColumnName: 'name' },
      nullable: false,
    },
  },
});
