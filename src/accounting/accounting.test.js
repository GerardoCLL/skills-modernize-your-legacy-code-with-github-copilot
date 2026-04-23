const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const appDir = __dirname;
const nodeExecutable = process.execPath;

function runApp(input) {
  return spawnSync(nodeExecutable, ['index.js'], {
    cwd: appDir,
    input,
    encoding: 'utf8',
  });
}

test('shows the main menu and the initial balance', () => {
  const result = runApp('1\n4\n');

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Account Management System/);
  assert.match(result.stdout, /1\. View Balance/);
  assert.match(result.stdout, /Current balance: 1000\.00/);
  assert.match(result.stdout, /Exiting the program\. Goodbye!/);
});

test('processes credit and debit operations against the shared balance', () => {
  const result = runApp('2\n250\n3\n100\n1\n4\n');

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Amount credited\. New balance: 1250\.00/);
  assert.match(result.stdout, /Amount debited\. New balance: 1150\.00/);
  assert.match(result.stdout, /Current balance: 1150\.00/);
});

test('rejects debits that exceed the available funds', () => {
  const result = runApp('3\n2000\n4\n');

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Insufficient funds for this debit\./);
  assert.match(result.stdout, /Exiting the program\. Goodbye!/);
});

test('rejects invalid menu options', () => {
  const result = runApp('9\n4\n');

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Invalid choice, please select 1-4\./);
});