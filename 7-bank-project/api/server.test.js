/* global fetch */
const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

async function listen(app) {
  const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
  });
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
}

async function close(server) {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function api(base, method, path, body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  return { status: response.status, json };
}

test('rejects a non-numeric amount instead of poisoning the balance', async () => {
  const app = createServer();
  const { server, base } = await listen(app);
  try {
    const created = await api(base, 'POST', '/api/accounts', {
      user: 'ada',
      currency: 'USD',
      balance: 20,
    });
    assert.equal(created.status, 201);
    assert.equal(created.json.balance, 20);

    const bad = await api(base, 'POST', '/api/accounts/ada/transactions', {
      date: '2020-10-05',
      object: 'Typo',
      amount: 'nope',
    });
    assert.equal(bad.status, 400);
    assert.equal(bad.json.error, 'Amount must be a number');

    const account = await api(base, 'GET', '/api/accounts/ada');
    assert.equal(account.json.balance, 20);
    assert.equal(account.json.transactions.length, 0);
  } finally {
    await close(server);
  }
});

test('accepts a zero amount and keeps the balance unchanged', async () => {
  const app = createServer();
  const { server, base } = await listen(app);
  try {
    await api(base, 'POST', '/api/accounts', { user: 'grace', currency: 'USD', balance: 15 });
    const zero = await api(base, 'POST', '/api/accounts/grace/transactions', {
      date: '2020-10-06',
      object: 'Note',
      amount: 0,
    });
    assert.equal(zero.status, 201);
    assert.equal(zero.json.amount, 0);

    const account = await api(base, 'GET', '/api/accounts/grace');
    assert.equal(account.json.balance, 15);
    assert.equal(account.json.transactions.length, 1);
  } finally {
    await close(server);
  }
});

test('deleting a transaction reverses its amount', async () => {
  const app = createServer();
  const { server, base } = await listen(app);
  try {
    await api(base, 'POST', '/api/accounts', { user: 'linus', currency: 'USD', balance: 40 });
    const created = await api(base, 'POST', '/api/accounts/linus/transactions', {
      date: '2020-10-07',
      object: 'Refund',
      amount: '12.5',
    });
    assert.equal(created.status, 201);
    assert.equal(created.json.amount, 12.5);

    const afterAdd = await api(base, 'GET', '/api/accounts/linus');
    assert.equal(afterAdd.json.balance, 52.5);

    const removed = await api(base, 'DELETE', `/api/accounts/linus/transactions/${created.json.id}`);
    assert.equal(removed.status, 204);

    const afterDelete = await api(base, 'GET', '/api/accounts/linus');
    assert.equal(afterDelete.json.balance, 40);
    assert.equal(afterDelete.json.transactions.length, 0);
  } finally {
    await close(server);
  }
});

test('the same transaction sent as a number or a numeric string conflicts', async () => {
  const app = createServer();
  const { server, base } = await listen(app);
  try {
    await api(base, 'POST', '/api/accounts', { user: 'ada2', currency: 'USD' });
    const first = await api(base, 'POST', '/api/accounts/ada2/transactions', {
      date: '2020-11-01',
      object: 'Bus',
      amount: 10,
    });
    assert.equal(first.status, 201);
    const second = await api(base, 'POST', '/api/accounts/ada2/transactions', {
      date: '2020-11-01',
      object: 'Bus',
      amount: '10',
    });
    assert.equal(second.status, 409);

    const account = await api(base, 'GET', '/api/accounts/ada2');
    assert.equal(account.json.balance, 10);
    assert.equal(account.json.transactions.length, 1);
  } finally {
    await close(server);
  }
});

test('opening balance must be numeric, and zero is allowed', async () => {
  const app = createServer();
  const { server, base } = await listen(app);
  try {
    const bad = await api(base, 'POST', '/api/accounts', {
      user: 'badbal',
      currency: 'USD',
      balance: '10abc',
    });
    assert.equal(bad.status, 400);

    const zero = await api(base, 'POST', '/api/accounts', {
      user: 'zerobal',
      currency: 'USD',
      balance: 0,
    });
    assert.equal(zero.status, 201);
    assert.equal(zero.json.balance, 0);
  } finally {
    await close(server);
  }
});
