// 1. Deposit money to machine
// 2. Determine the number to bet
// 3. collect bet amount
// 4. Spin to win
// 5. check if the user won
// 6. give the user their winning
// 7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

//1.
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};
//2.
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3):");
    const numberOfLines = parseFloat(lines);
    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("invalid deposit amount, try again.");
    } else {
      return numberOfLines;
    }
  }
};

//3.
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line:");
    const numberBet = parseFloat(bet);
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("invalid bet try again.");
    } else {
      return numberBet;
    }
  }
};

//4.
const spin = () => {
  const symbols = [];
  for ([symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

//5.
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

//6.
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("Current Balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("Jackpot! $" + winnings.toString());

    if (balance <= 0) {
      console.log("no money left");
      break;
    }
    const playagain = prompt("Wanna play again? (y/n)");

    if (playagain != "y") {
      console.log("Thanks for playing!");
    }
  }
};
game();
