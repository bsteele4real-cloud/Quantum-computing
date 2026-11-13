const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const pkg = require('./package.json');

// App constants
const port = process.env.PORT || 5000;
const apiPrefix = '/api';

function seedAccount() {
  return {
    user: 'test',
    currency: '$',
    description: 'Test account',
    balance: 75,
    transactions: [
      { id: '1', date: '2020-10-01', object: 'Pocket money', amount: 50 },
      { id: '2', date: '2020-10-03', object: 'Book', amount: -10 },
      { id: '3', date: '2020-10-04', object: 'Sandwich', amount: -5 },
    ],
  };
}

// Accept numbers and numeric strings. Reject "", null, and partial numbers like "10abc".
function parseFiniteNumber(raw) {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string' && raw.trim() !== '') return Number(raw);
  return NaN;
}

function createServer() {
  // Store data in-memory, not suited for production use!
  const db = {
    test: seedAccount(),
  };

  // Create the Express app & setup middlewares
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors({ origin: /http:\/\/(127(\.\d){3}|localhost)/ }));
  app.options('*', cors());

  // ***************************************************************************

  // Configure routes
  const router = express.Router();

  // Get server infos
  router.get('/', (req, res) => {
    return res.send(`${pkg.description} v${pkg.version}`);
  });

  // ----------------------------------------------

  // Create an account
  router.post('/accounts', (req, res) => {
    // Check mandatory request parameters
    if (!req.body.user || !req.body.currency) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Check if account already exists
    if (db[req.body.user]) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Convert balance to number if needed. 0 is a valid opening balance.
    let balance = 0;
    if (req.body.balance !== undefined && req.body.balance !== null && req.body.balance !== '') {
      balance = parseFiniteNumber(req.body.balance);
      if (!Number.isFinite(balance)) {
        return res.status(400).json({ error: 'Balance must be a number' });
      }
    }

    // Create account
    const account = {
      user: req.body.user,
      currency: req.body.currency,
      description: req.body.description || `${req.body.user}'s budget`,
      balance,
      transactions: [],
    };
    db[req.body.user] = account;

    return res.status(201).json(account);
  });

  // ----------------------------------------------

  // Get all data for the specified account
  router.get('/accounts/:user', (req, res) => {
    const account = db[req.params.user];

    // Check if account exists
    if (!account) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    return res.json(account);
  });

  // ----------------------------------------------

  // Remove specified account
  router.delete('/accounts/:user', (req, res) => {
    const account = db[req.params.user];

    // Check if account exists
    if (!account) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Removed account
    delete db[req.params.user];

    res.sendStatus(204);
  });

  // ----------------------------------------------

  // Add a transaction to a specific account
  router.post('/accounts/:user/transactions', (req, res) => {
    const account = db[req.params.user];

    // Check if account exists
    if (!account) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // 0 is a real amount. Only null, undefined, and "" count as missing.
    if (!req.body.date || !req.body.object || req.body.amount === undefined || req.body.amount === null || req.body.amount === '') {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const amount = parseFiniteNumber(req.body.amount);
    // Number.isFinite rejects NaN. The old `amount && isNaN(amount)` check never
    // fired, because NaN is falsy and the && short-circuited.
    if (!Number.isFinite(amount)) {
      return res.status(400).json({ error: 'Amount must be a number' });
    }

    // Generates an ID for the transaction from the parsed amount, so "10" and 10 match.
    const id = crypto
      .createHash('md5')
      .update(req.body.date + req.body.object + amount)
      .digest('hex');

    // Check that transaction does not already exist
    if (account.transactions.some((transaction) => transaction.id === id)) {
      return res.status(409).json({ error: 'Transaction already exists' });
    }

    // Add transaction
    const transaction = {
      id,
      date: req.body.date,
      object: req.body.object,
      amount,
    };
    account.transactions.push(transaction);

    // Update balance
    account.balance += transaction.amount;

    return res.status(201).json(transaction);
  });

  // ----------------------------------------------

  // Remove specified transaction from account
  router.delete('/accounts/:user/transactions/:id', (req, res) => {
    const account = db[req.params.user];

    // Check if account exists
    if (!account) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const transactionIndex = account.transactions.findIndex(
      (transaction) => transaction.id === req.params.id
    );

    // Check if transaction exists
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction does not exist' });
    }

    // Remove transaction and reverse its effect on the balance.
    const removed = account.transactions[transactionIndex];
    account.transactions.splice(transactionIndex, 1);
    if (Number.isFinite(removed.amount)) {
      account.balance -= removed.amount;
    }

    res.sendStatus(204);
  });

  // ***************************************************************************

  // Add 'api' prefix to all routes
  app.use(apiPrefix, router);
  return app;
}

// Start the server only when this file is the program, so tests can import it.
if (require.main === module) {
  const app = createServer();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { createServer };
