// CLI driver -- quick way to spot check various funcitonality.

import Deck from './js/Deck';
import clc from 'cli-color';
import WarGame from './js/WarGame';
import EndlessWarGame from './js/EndlessWarGame';

function printDeck(pDeck) {
  while(pDeck.currentSize !== 0) {
    const card = pDeck.deal();
    console.log(`Suit: ${card._suit}, Rank: ${card.rank}`);
  }
}

function printResult(roundOutcome) {
  if (roundOutcome.winner) {
    console.log(`Winner: ${roundOutcome.winner.name}`);
  } else {
    console.log(clc.red('No Winner'));
  }

  // supress linter - yes, I know I'm not making an assignment...
  roundOutcome.war ? console.log('War: ' + clc.green('Yes')) : console.log('War: ' + clc.red('No')); // jshint ignore:line

  roundOutcome.draws.map((d, i) => {
    const formattedDraw = d.map(c => { c !== null ? return `S${c.suit}-R${c.rank}` : return 'XXXX'; });
    console.log(`Player ${i + 1}: ${formattedDraw}`);
  });
}

let deck = new Deck(4, 4);

console.log(clc.cyan('****************'));
console.log(clc.cyan('* Ordered Deck *'));
console.log(clc.cyan('****************\n'));

printDeck(deck);

console.log(clc.cyan('\n*****************'));
console.log(clc.cyan('* Shuffled Deck *'));
console.log(clc.cyan('*****************\n'));

deck = new Deck(4, 4);
deck.shuffle();

printDeck(deck);

console.log(clc.cyan('\n******************************'));
console.log(clc.cyan('* Endless War - Sample Round *'));
console.log(clc.cyan('******************************\n'));

deck = new Deck(4, 13); // a real deck!
deck.shuffle();
let game = new EndlessWarGame(deck, 4);

let outcome = game.playRound();

printResult(outcome);

console.log(clc.cyan('\n****************************'));
console.log(clc.cyan('* Endless War - Sample War *'));
console.log(clc.cyan('****************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new EndlessWarGame(deck, 4);

while (true) {
  let outcome = game.playRound();
  if (!outcome.war) {
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n************************************'));
console.log(clc.cyan('* Endless War - Sample Double+ War *'));
console.log(clc.cyan('************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new EndlessWarGame(deck, 4);
let doubleWar = false;

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (!outcome.draws.some(d => d.length === 3)) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n***************************************'));
console.log(clc.cyan('* Endless War - Sample Three+ Way War *'));
console.log(clc.cyan('***************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new EndlessWarGame(deck, 4);

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (outcome.draws.filter(d => d.length > 1).length < 3) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}


console.log(clc.cyan('\n*******************************************'));
console.log(clc.cyan('* Endless War - Simulate 1,000,000 rounds *'));
console.log(clc.cyan('*******************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new EndlessWarGame(deck, 2);

let start = new Date();

console.log(clc.blackBright('Starting Simulation...'));
const outcomes = [];
for (let i = 0; i < 1000000; ++i) {
  outcomes.push(game.playRound());
}
let end = new Date();

let span = end.getTime() - start.getTime();
let secondsDiff = Math.floor(span / (1000));
console.log(clc.blackBright(`Simulation complete in ${secondsDiff} seconds`));

console.log(`Wars: ${outcomes.filter(o => o.war).length}`);
console.log(`Player 1 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 1').length}`);
console.log(`Player 2 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 2').length}`);

/*******************************************************************************

STANDARD WarGame

********************************************************************************/

console.log(clc.cyan('\n*******************************'));
console.log(clc.cyan('* Standard War - Sample Round *'));
console.log(clc.cyan('*******************************\n'));

deck = new Deck(4, 13); // a real deck!
deck.shuffle();
game = new WarGame(deck, 4);

outcome = game.playRound();

printResult(outcome);

console.log(clc.cyan('\n*****************************'));
console.log(clc.cyan('* Standard War - Sample War *'));
console.log(clc.cyan('*****************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

while (true) {
  let outcome = game.playRound();
  if (!outcome.war) {
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n*************************************'));
console.log(clc.cyan('* Standard War - Sample Double+ War *'));
console.log(clc.cyan('*************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);
doubleWar = false;

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (!outcome.draws.some(d => d.length === 3)) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n****************************************'));
console.log(clc.cyan('* Standard War - Sample Three+ Way War *'));
console.log(clc.cyan('****************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (outcome.draws.filter(d => d.length > 1).length < 3) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}


console.log(clc.cyan('\n**************************************'));
console.log(clc.cyan('* Standard War - Simulate 1,000 games *'));
console.log(clc.cyan('***************************************\n'));

start = new Date();
let wins = [0,0,0,0];
let warCount = 0;
let draws = 0;
let numTurns = [];

console.log(clc.blackBright('Starting Simulation...'));

for (let i = 0; i < 1000; ++i) {
  deck = new Deck(4, 13);
  deck.shuffle();
  game = new WarGame(deck, 4);
  let roundCount = 0;

  while(true) {
    let result = game.playRound();
    ++roundCount;

    if (roundCount > 5000) {
      ++draws;
      numTurns.push(roundCount);
      break;
    }

    if (result.war) { ++warCount; }
    if (result.gameOver) {
      numTurns.push(roundCount);
      if (result.winner === null) {
        printResult(result);
      }
      if (result.winner.name === 'Player 1') { ++wins[0]; }
      if (result.winner.name === 'Player 2') { ++wins[1]; }
      if (result.winner.name === 'Player 3') { ++wins[2]; }
      if (result.winner.name === 'Player 4') { ++wins[3]; }
      break;
    }
  }
}
end = new Date();

span = end.getTime() - start.getTime();
secondsDiff = Math.floor(span / (1000));
console.log(clc.blackBright(`Simulation complete in ${secondsDiff} seconds`));

console.log(`Wars: ${warCount}`);
console.log(`Players got bored and did something else: ${draws} (${Math.floor((draws/1000) * 100)}%)`);

let rounds = numTurns.reduce(function(a, b) { return a + b; });
let avg = rounds / numTurns.length;

console.log(`Average number of turns ${avg}`);

for (let i = 0; i < 4; ++i) {
  console.log(`Player ${i + 1} Wins: ${wins[i]}`);
}
