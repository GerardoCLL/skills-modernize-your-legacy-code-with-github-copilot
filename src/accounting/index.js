const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

let storageBalanceCents = 100000;

function formatMoney(cents) {
  return (cents / 100).toFixed(2);
}

function parseAmountToCents(input) {
  const amount = Number(input);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return Math.round(amount * 100);
}

function dataProgram(operationType, balanceCents) {
  if (operationType === 'READ') {
    return storageBalanceCents;
  }

  if (operationType === 'WRITE') {
    storageBalanceCents = balanceCents;
    return storageBalanceCents;
  }

  return storageBalanceCents;
}

async function operations(operationType, rl) {
  if (operationType === 'TOTAL ') {
    const currentBalance = dataProgram('READ');
    console.log(`Current balance: ${formatMoney(currentBalance)}`);
    return;
  }

  if (operationType === 'CREDIT') {
    const amountInput = await rl.question('Enter credit amount: ');
    const amountCents = parseAmountToCents(amountInput.trim());

    if (amountCents === null) {
      console.log('Invalid amount, please enter a numeric value.');
      return;
    }

    const currentBalance = dataProgram('READ');
    const updatedBalance = currentBalance + amountCents;

    dataProgram('WRITE', updatedBalance);
    console.log(`Amount credited. New balance: ${formatMoney(updatedBalance)}`);
    return;
  }

  if (operationType === 'DEBIT ') {
    const amountInput = await rl.question('Enter debit amount: ');
    const amountCents = parseAmountToCents(amountInput.trim());

    if (amountCents === null) {
      console.log('Invalid amount, please enter a numeric value.');
      return;
    }

    const currentBalance = dataProgram('READ');

    if (currentBalance >= amountCents) {
      const updatedBalance = currentBalance - amountCents;

      dataProgram('WRITE', updatedBalance);
      console.log(`Amount debited. New balance: ${formatMoney(updatedBalance)}`);
      return;
    }

    console.log('Insufficient funds for this debit.');
  }
}

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

async function main() {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  let continueFlag = true;

  try {
    while (continueFlag) {
      displayMenu();

      const choice = await rl.question('Enter your choice (1-4): ');

      switch (choice.trim()) {
        case '1':
          await operations('TOTAL ', rl);
          break;
        case '2':
          await operations('CREDIT', rl);
          break;
        case '3':
          await operations('DEBIT ', rl);
          break;
        case '4':
          continueFlag = false;
          break;
        default:
          console.log('Invalid choice, please select 1-4.');
      }
    }

    console.log('Exiting the program. Goodbye!');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exitCode = 1;
});