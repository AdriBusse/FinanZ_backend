const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SavingTransactionService } = require('../dist/saving/services/saving-transaction.service');

function fixture(parent) {
  let saved;
  let lookup;
  const repository = {
    findOne: async options => { lookup = options; return parent; },
    create: value => value,
    save: async value => { saved = value; return value; },
  };
  return {
    service: new SavingTransactionService(repository, { findOne: async () => ({ id: 7 }) }),
    saved: () => saved,
    lookup: () => lookup,
  };
}

test('links repayments directly to the root, including when added from a repayment', async () => {
  for (const parent of [{ id: 1, parentTransactionId: null }, { id: 2, parentTransactionId: 1 }]) {
    const f = fixture(parent);
    const result = await f.service.createSavingTransaction('Repayment', 1000, '7', undefined, { id: 9 }, String(parent.id));
    assert.equal(result.parentTransactionId, 1);
    assert.deepEqual(f.lookup().where, { id: parent.id, user: { id: 9 }, depot: { id: 7 } });
  }
});

test('rejects missing parents and parents outside the user or depot scope', async () => {
  const f = fixture(null);
  await assert.rejects(() => f.service.createSavingTransaction('Repayment', 1000, '7', undefined, { id: 9 }, '99'), /Cannot find connected transaction/);
  assert.equal(f.saved(), undefined);
});

test('keeps ordinary transactions standalone', async () => {
  const f = fixture(null);
  const result = await f.service.createSavingTransaction('Deposit', 1000, '7', undefined, { id: 9 });
  assert.equal(result.parentTransactionId, null);
  assert.equal(f.lookup(), undefined);
});
