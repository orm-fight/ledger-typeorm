'use strict';

const Account = require('./entities/Account');
const JournalEntry = require('./entities/JournalEntry');
const { balance } = require('./utils');

async function createAccount(db, { name, type }) {
  await db.getRepository(Account).insert({ name, type });
}

async function postEntry(db, { description, debit, credit, amount, date }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(`amount must be a positive integer (got ${amount})`);
  }

  const entry = await db.getRepository(JournalEntry).save({
    description,
    account_debit: debit,
    account_credit: credit,
    amount,
    date,
  });
  return entry.id;
}

async function getBalance(db, accountName) {
  const account = await db.getRepository(Account).findOneBy({ name: accountName });
  if (!account) throw new Error(`unknown account: ${accountName}`);

  const totals = await db
    .getRepository(JournalEntry)
    .createQueryBuilder('e')
    .select(
      'COALESCE(SUM(CASE WHEN e.account_debit  = :name THEN e.amount END), 0)',
      'debit_total'
    )
    .addSelect(
      'COALESCE(SUM(CASE WHEN e.account_credit = :name THEN e.amount END), 0)',
      'credit_total'
    )
    .setParameter('name', accountName)
    .getRawOne();

  return balance({
    type: account.type,
    debit_total: Number(totals.debit_total),
    credit_total: Number(totals.credit_total),
  });
}

async function trialBalance(db) {
  const rows = await db.query(`
    SELECT a.name, a.type,
           COALESCE(SUM(CASE WHEN e.account_debit  = a.name THEN e.amount END), 0) AS debit_total,
           COALESCE(SUM(CASE WHEN e.account_credit = a.name THEN e.amount END), 0) AS credit_total
    FROM accounts a
    LEFT JOIN journal_entries e
      ON e.account_debit = a.name OR e.account_credit = a.name
    GROUP BY a.name, a.type
    ORDER BY a.name
  `);
  return rows.map((totals) => ({
    account: totals.name,
    type: totals.type,
    balance: balance({
      type: totals.type,
      debit_total: Number(totals.debit_total),
      credit_total: Number(totals.credit_total),
    }),
  }));
}

module.exports = { createAccount, postEntry, getBalance, trialBalance };
